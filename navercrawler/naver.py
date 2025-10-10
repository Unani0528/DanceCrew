#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
crawl_all_stocks.py

설명:
 - Naver 시가총액 페이지에서 종목 코드 수집(진행 표시)
 - 수집된 종목별로 병렬 크롤링(각 종목당 최대 PER_STOCK_MAX_POSTS 게시글 수집)
 - 결과: output/<code>/<code>_posts.csv 와 output/all_posts_sorted.csv 생성 (종목별 정렬)

주의:
 - 각 워커는 Chrome WebDriver 인스턴스를 띄웁니다. 메모리/CPU 사용량이 큽니다.
 - 대량 크롤링은 사이트에 부하를 줍니다. 적절히 rate-limit(지연) 조절하세요.
"""

import os
import time
import csv
import traceback
from multiprocessing import Pool, cpu_count
from urllib.parse import parse_qs, urlparse

import requests
from bs4 import BeautifulSoup
import re

# Selenium
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import WebDriverException, TimeoutException

# webdriver-manager (자동 드라이버 설치; 설치 안되어 있으면 수동 chromedriver 필요)
try:
    from webdriver_manager.chrome import ChromeDriverManager
    from selenium.webdriver.chrome.service import Service
    WD_MANAGER_AVAILABLE = True
except Exception:
    WD_MANAGER_AVAILABLE = False

try:
    from tqdm import tqdm
    TQDM_AVAILABLE = True
except Exception:
    TQDM_AVAILABLE = False

# ================== CONFIG ==================
OUTPUT_DIR = "output"
CODES_CSV = os.path.join(OUTPUT_DIR, "stock_codes.csv")
ALL_POSTS_CSV = os.path.join(OUTPUT_DIR, "all_posts_sorted.csv")
PER_STOCK_MAX_POSTS = 100            # 종목 당 수집할 게시글 수
PARALLEL_WORKERS = max(1, min(5, cpu_count()))  # 동시에 실행할 프로세스 수 (환경에 맞게 조정)
REQUESTS_TIMEOUT = 10
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
# ============================================

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ----------------- 1) 종목 코드 수집 -----------------
def fetch_stock_codes(save_path=CODES_CSV,
                      market_url_template="https://finance.naver.com/sise/sise_market_sum.naver?&page={}",
                      max_pages=None):
    """
    종목 코드 수집 with 진행 표시.
    - max_pages: 테스트용으로 페이지 제한을 걸고 싶으면 지정 (None이면 끝까지)
    """
    print("🔎 종목 코드 수집 시작...")
    codes = []
    page = 1

    use_tqdm = TQDM_AVAILABLE

    # tqdm가 설치되어 있고 max_pages 지정 시 고정 반복자 사용
    if use_tqdm and max_pages:
        page_iter = range(1, max_pages + 1)
        pbar = tqdm(page_iter, desc="Pages", unit="pg")
    elif use_tqdm and not max_pages:
        # 무한 반복에 tqdm 사용(unknown total)
        def generator():
            p = 1
            while True:
                yield p
                p += 1
        pbar = tqdm(generator(), desc="Pages", unit="pg")
    else:
        pbar = None

    try:
        while True:
            if pbar is None:
                current_page = page
                print(f"  ▶ 처리중: 페이지 {current_page} (누계 종목 {len(codes)})")
            else:
                try:
                    current_page = next(iter(pbar))
                    # above pattern doesn't advance pbar correctly; instead iterate pbar directly below
                    # so we break and iterate the pbar properly
                    # fallback: iterate using for
                    raise StopIteration
                except StopIteration:
                    # proper iteration for tqdm when unknown total
                    if use_tqdm and not max_pages:
                        for current_page in pbar:
                            # process current_page inside for-loop
                            url = market_url_template.format(current_page)
                            resp = requests.get(url, timeout=REQUESTS_TIMEOUT, headers={"User-Agent": USER_AGENT})
                            if resp.status_code != 200:
                                print(f"  ⚠️ 페이지 {current_page} 응답 코드 {resp.status_code} — 중단")
                                pbar.close()
                                return codes
                            soup = BeautifulSoup(resp.text, "html.parser")

                            table = soup.find("table", {"class": "type_2"})
                            if not table:
                                print(f"  ⚠️ 페이지 {current_page}: 종목 테이블을 찾을 수 없음 — 중단")
                                pbar.close()
                                return codes

                            rows = table.select("tbody tr")
                            page_codes = []
                            for r in rows:
                                a = r.find("a", href=True)
                                if not a:
                                    continue
                                href = a["href"]
                                parsed = parse_qs(urlparse(href).query)
                                code = parsed.get("code", [None])[0]
                                name = a.get_text(strip=True)
                                if code and code.isdigit():
                                    page_codes.append((code, name))

                            if not page_codes:
                                print(f"  ℹ️ 페이지 {current_page}: 더 이상 종목 없음 — 중단")
                                pbar.close()
                                return codes

                            new_added = 0
                            existing = set([c for c, _ in codes])
                            for code, name in page_codes:
                                if code not in existing:
                                    codes.append((code, name))
                                    existing.add(code)
                                    new_added += 1

                            pbar.set_postfix({"collected": len(codes), "new_on_page": new_added})
                            time.sleep(0.5)
                        # loop ends
                        break
                    else:
                        # case where pbar was created with finite range; handle below normally
                        pass

            # normal (non-tqdm) or finite tqdm handling
            url = market_url_template.format(current_page)
            try:
                resp = requests.get(url, timeout=REQUESTS_TIMEOUT, headers={"User-Agent": USER_AGENT})
                if resp.status_code != 200:
                    print(f"  ⚠️ 페이지 {current_page} 응답 코드 {resp.status_code} — 중단")
                    break
                soup = BeautifulSoup(resp.text, "html.parser")

                table = soup.find("table", {"class": "type_2"})
                if not table:
                    print(f"  ⚠️ 페이지 {current_page}: 종목 테이블을 찾을 수 없음 — 중단")
                    break

                rows = table.select("tbody tr")
                page_codes = []
                for r in rows:
                    a = r.find("a", href=True)
                    if not a:
                        continue
                    href = a["href"]
                    parsed = parse_qs(urlparse(href).query)
                    code = parsed.get("code", [None])[0]
                    name = a.get_text(strip=True)
                    if code and code.isdigit():
                        page_codes.append((code, name))

                if not page_codes:
                    print(f"  ℹ️ 페이지 {current_page}: 더 이상 종목 없음 — 중단")
                    break

                new_added = 0
                existing = set([c for c, _ in codes])
                for code, name in page_codes:
                    if code not in existing:
                        codes.append((code, name))
                        existing.add(code)
                        new_added += 1

                if pbar is None:
                    print(f"  ✅ 페이지 {current_page} 완료 — 페이지에서 추가 {new_added}개 (누계 {len(codes)})")
                else:
                    # finite tqdm: update manually
                    pbar.update(1)
                    pbar.set_postfix({"collected": len(codes), "new_on_page": new_added})

                page += 1
                if max_pages and page > max_pages:
                    print(f"  ℹ️ max_pages({max_pages}) 도달 — 중단")
                    break

                time.sleep(0.5)

            except Exception as e:
                print(f"  ❌ 종목 수집 오류 (페이지 {current_page}): {e}")
                traceback.print_exc()
                break

    finally:
        if pbar is not None:
            try:
                pbar.close()
            except Exception:
                pass

    # 저장
    with open(save_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["code", "name"])
        writer.writerows(codes)

    print(f"📁 종목 코드 저장됨: {save_path} ({len(codes)}개)")
    return codes

# ----------------- 2) Selenium 드라이버 생성 -----------------
def create_chrome_driver(headless=True):
    options = Options()
    if headless:
        # --headless=new 는 최신 버전용; 환경에 따라 --headless 로 변경 가능
        options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument(f"user-agent={USER_AGENT}")
    # 추가 옵션: 창 크기, GPU 비활성 등
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")

    try:
        if WD_MANAGER_AVAILABLE:
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=options)
        else:
            driver = webdriver.Chrome(options=options)
        return driver
    except WebDriverException as e:
        raise

# ----------------- 3) 게시글 상세 크롤러 -----------------
def crawl_post_detail(driver, nid, code, wait_timeout=20):
    """
    driver는 이미 실행된 Selenium WebDriver 인스턴스
    """
    try:
        wait = WebDriverWait(driver, wait_timeout)
        url = f"https://finance.naver.com/item/board_read.naver?code={code}&nid={nid}"
        driver.get(url)

        # 제목
        title = wait.until(EC.presence_of_element_located(
            (By.XPATH, "/html/body/div[3]/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/th[1]/strong")
        )).text.strip()

        # 메타 정보
        meta_text = wait.until(EC.presence_of_element_located(
            (By.XPATH, "/html/body/div[3]/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/th[2]")
        )).text.strip()

        view = like = dislike = None
        view_m = re.search(r'조회\s*(\d+)', meta_text)
        like_m = re.search(r'추천\s*(\d+)', meta_text)
        dislike_m = re.search(r'비추천\s*(\d+)', meta_text)
        view = int(view_m.group(1)) if view_m else None
        like = int(like_m.group(1)) if like_m else None
        dislike = int(dislike_m.group(1)) if dislike_m else None

        # iframe 안 본문으로 전환
        content = ""
        try:
            wait.until(EC.frame_to_be_available_and_switch_to_it(
                (By.XPATH, "/html/body/div[3]/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[3]/td/iframe")
            ))
            container = wait.until(EC.presence_of_element_located(
                (By.XPATH, "/html/body/div[1]/div[1]/div/div/div/div/div/div/div")
            ))
            # 본문이 로딩될 때까지 짧게 대기
            start = time.time()
            while ("로딩중" in container.text or len(container.text.strip()) < 5) and (time.time() - start) < 10:
                time.sleep(0.4)
            p_tags = container.find_elements(By.TAG_NAME, "p")
            content = " ".join([p.text.strip() for p in p_tags if p.text.strip()])
            if not content:
                content = container.text.strip().replace("\n", " ")
            driver.switch_to.default_content()
        except Exception:
            # iframe이 없거나 구조가 다른 경우 fallback
            try:
                fallback = driver.find_element(By.XPATH, "/html/body/div[3]/div[2]/div[2]/div[1]/div[3]/div")
                content = fallback.text.strip()
            except Exception:
                content = ""

        return {
            "stock_code": code,
            "nid": nid,
            "title": title,
            "content": content,
            "view_count": view,
            "like_count": like,
            "dislike_count": dislike
        }
    except Exception as e:
        # 상세 크롤링 실패
        return None

# ----------------- 4) 종목 단위 크롤러 (프로세스 작업) -----------------
def crawl_posts_for_code(code_name_tuple):
    code, name = code_name_tuple

    print(f"🔁 [{code}] 크롤링 시작: {name}")
    try:
        driver = create_chrome_driver(headless=True)
    except Exception as e:
        print(f"  ❌ [{code}] WebDriver 생성 실패: {e}")
        return (code, name, [])

    posts = []
    seen_nids = set()
    page = 1
    try:
        wait = WebDriverWait(driver, 12)
        while len(posts) < PER_STOCK_MAX_POSTS:
            list_url = f"https://finance.naver.com/item/board.naver?code={code}&page={page}"
            try:
                driver.get(list_url)
                wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[3]/div[2]/div[2]/div[1]/div[3]/table[1]")))
                rows = driver.find_elements(By.XPATH, "/html/body/div[3]/div[2]/div[2]/div[1]/div[3]/table[1]/tbody/tr")
                if len(rows) <= 4:
                    break
                for row in rows[4:]:
                    if len(posts) >= PER_STOCK_MAX_POSTS:
                        break
                    try:
                        link = row.find_element(By.XPATH, "./td[2]/a")
                        href = link.get_attribute("href")
                        nid = parse_qs(urlparse(href).query).get("nid", [None])[0]
                        if nid and nid.isdigit() and nid not in seen_nids:
                            seen_nids.add(nid)
                            post = crawl_post_detail(driver, nid, code)
                            if not post:
                                time.sleep(0.5)
                                post = crawl_post_detail(driver, nid, code)
                            if post:
                                posts.append(post)
                                print(f"  [{code}] 수집: {nid} ({len(posts)}/{PER_STOCK_MAX_POSTS})")
                            time.sleep(0.35)
                    except Exception:
                        continue
                page += 1
                time.sleep(0.6)
            except TimeoutException:
                print(f"  ⚠️ [{code}] 페이지 {page} 로드 타임아웃 — 다음페이지로")
                page += 1
            except Exception as e:
                print(f"  ❌ [{code}] 리스트 페이지 에러: {e}")
                break

        print(f"✅ [{code}] 완료: {len(posts)}개 수집")
        return (code, name, posts)
    except Exception as e:
        print(f"  ❌ [{code}] 예외: {e}")
        traceback.print_exc()
        return (code, name, posts)
    finally:
        try:
            driver.quit()
        except Exception:
            pass

# ----------------- 5) 병렬 실행 및 종목별 정렬 저장 -----------------
def run_parallel_crawl(codes, workers=PARALLEL_WORKERS):
    print(f"⚡ 병렬 크롤링 시작: 작업자 {workers}, 종목 수 {len(codes)}")
    with Pool(processes=workers) as pool:
        results = pool.map(crawl_posts_for_code, codes)

    # 종목 코드로 정렬
    print(f"📊 종목별로 정렬 중...")
    results_sorted = sorted(results, key=lambda x: x[0])  # code 기준 정렬
    
    # 정렬된 순서로 통합 파일 저장
    total = 0
    with open(ALL_POSTS_CSV, "w", newline="", encoding="utf-8-sig") as outf:
        fieldnames = ["stock_code", "stock_name", "nid", "title", "content", "view_count", "like_count", "dislike_count"]
        writer = csv.DictWriter(outf, fieldnames=fieldnames)
        writer.writeheader()
        
        for code, name, posts in results_sorted:
            total += len(posts)
            # posts 리스트에서 직접 쓰기 (종목명 추가)
            for post in posts:
                row = post.copy()
                row['stock_name'] = name
                # 컬럼 순서 맞추기
                ordered_row = {
                    'stock_code': row['stock_code'],
                    'stock_name': row['stock_name'],
                    'nid': row['nid'],
                    'title': row['title'],
                    'content': row['content'],
                    'view_count': row['view_count'],
                    'like_count': row['like_count'],
                    'dislike_count': row['dislike_count']
                }
                writer.writerow(ordered_row)
    
    print(f"📦 종목별 정렬 완료: {ALL_POSTS_CSV} (총 {total}개 게시글, {len(results_sorted)}개 종목)")
    return results_sorted

# ----------------- 6) 실행 진입점 -----------------
if __name__ == "__main__":
    # 1) 종목 코드 수집 (파일이 없으면 수집, 있으면 불러오기)
    if not os.path.exists(CODES_CSV):
        # 테스트 시 max_pages로 제한 가능: fetch_stock_codes(max_pages=3)
        codes = fetch_stock_codes()
    else:
        with open(CODES_CSV, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            codes = [(r["code"], r.get("name", "")) for r in reader]
        print(f"ℹ️ 기존 종목 코드 불러옴: {len(codes)}개")

    # 테스트용: 상위 N개만 실행
    codes = codes[:100]

    # 2) 병렬로 크롤링 실행
    results = run_parallel_crawl(codes, workers=PARALLEL_WORKERS)

    # 요약 출력
    print("---- 요약 ----")
    for code, name, posts in results:
        print(f"  {code} ({name}): {len(posts)}개")
    print("완료.")