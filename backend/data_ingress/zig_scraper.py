import re
from xml import dom
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
from html2text import HTML2Text
from readability import Document
from urllib.parse import urlparse
import undetected_chromedriver as uc
import uuid

import PyPDF2
import requests
import io
import os 
import time
import random

ZENROWS_APIKEY = "5be44795d3a2cf9f3693525935f3b0c7765b1ac0"

def generateRow(scraped_links, logger, link: str, domain_name: str):
    delay = random.uniform(1, 5)
    time.sleep(delay)
    
    page_source = _getPageSource(logger, link)
    logger.info('Page source done')
    scraped_links.append(link)

    main_html_content = _getMainHTMLContent(page_source)
    logger.info('Reader mode page source done')
    parsed_html_content = _getParsedContent(main_html_content)
    parsed_content = f'{link} \n'
    parsed_content += parsed_html_content
    logger.info('Converted text from HTML')

    base_path = os.path.dirname(__file__)
    directory = os.path.join(base_path, "data_ingress", domain_name, "webpage")

    create_directory(directory)

    directory_len = len([f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))])
    file_name = f'page_{uuid.uuid4().hex[:8]}'
    _saveToTextFile(parsed_content, directory, file_name)

    pdf_links = _getPDFLink(page_source)
    for pdf_link in pdf_links:
        try:
            if pdf_link in scraped_links:
                continue

            if pdf_link[0] == '/':
                pdf_link = 'https://www.' + domain_name + pdf_link

            print(pdf_link)
            scraped_links.append(pdf_link)
            _getPDFContent(domain_name, pdf_link) #gets and saves to txt file
            print(f'Saved pdf link {pdf_link}')
        except:
            continue

    all_links = _getLinks(page_source)

    for inner_link in all_links:
        if inner_link in scraped_links:
            continue

        # remove index and pdf for elitigation specifically
        if (inner_link[0] == '/') and ('woff' not in inner_link and 'assets' not in inner_link and 'index' not in inner_link and 'Index' not in inner_link and 'pdf' not in inner_link and '/images/' not in inner_link and 'css' not in inner_link and '.ico' not in inner_link and '.js' not in inner_link and '/Telerik.Web.UI.' not in inner_link and '.png' not in inner_link and '.jpg' not in inner_link and '/Cwp/' not in inner_link and 'css?' not in inner_link):
            if inner_link.startswith('/isd/'): #unique case for mha.gov.sg/isd
                link = 'https://www.mha.gov.sg' + inner_link
                if link not in scraped_links:
                    try:
                        scraped_links.append(link)
                        print(f'Links with black slash scraped: {link}')
                        generateRow(scraped_links, logger, link, domain_name)
                    except:
                        continue
            elif inner_link.startswith('/hta/'): #unique case for mha.gov.sg/hta
                link = 'https://www.mha.gov.sg' + inner_link
                if link not in scraped_links:
                    try:
                        scraped_links.append(link)
                        print(f'Links with black slash scraped: {link}')
                        generateRow(scraped_links, logger, link, domain_name)
                    except:
                        continue
            else: # remaining cases
                link = 'https://www.' + domain_name + inner_link
                if link not in scraped_links:
                    try:
                        scraped_links.append(link)
                        print(f'Links with black slash scraped: {link}')
                        generateRow(scraped_links, logger, link, domain_name)
                    except:
                        continue

        elif inner_link.startswith('https://www.' + domain_name) and ('.pdf' not in inner_link):
            scraped_links.append(inner_link)
            print(f'Proper links starting w black slash scraped: {inner_link}')
            try:
                generateRow(scraped_links, logger, inner_link, domain_name)
            except:
                continue

    return scraped_links

def getMarkdownWordCount(parsed_content: str) -> int:
    text = parsed_content

    # Comments
    text = re.sub(r'<!--(.*?)-->', '', text, flags=re.MULTILINE)
    # Tabs to spaces
    text = text.replace('\t', '    ')
    # More than 1 space to 4 spaces
    text = re.sub(r'[ ]{2,}', '    ', text)
    # Footnotes
    text = re.sub(r'^\[[^]]*\][^(].*', '', text, flags=re.MULTILINE)
    # Custom header IDs
    text = re.sub(r'{#.*}', '', text)
    # Replace newlines with spaces for uniform handling
    text = text.replace('\n', ' ')
    # Remove images
    text = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', text)
    # Remove HTML tags
    text = re.sub(r'</?[^>]*>', '', text)
    # Remove special characters
    text = re.sub(r'[#*`~\-–^=<>+|/:]', '', text)
    # Remove footnote references
    text = re.sub(r'\[[0-9]*\]', '', text)
    # Remove enumerations
    text = re.sub(r'[0-9#]*\.', '', text)

    return len(text.split())

def _getPageSource(logger, url: str) -> str:
    apikey = ZENROWS_APIKEY
    params = {
        'url': url,
        'apikey': apikey,
        'js_render': 'true',
    }
    response = requests.get('https://api.zenrows.com/v1/', params=params)
    return response.text

def create_directory(directory: str):
    # Create the directory if it does not exist
    os.makedirs(directory, exist_ok=True)

def _saveToTextFile(text: str, directory: str, file_name: str):
    if 'RESP001' in text or 'RESP002' in text or 'REQS004' in text or 'Secure websites use HTTPS' in text:
        pass
    else:
        with open(f'{directory}/{file_name}.txt', 'w', encoding = 'utf-8') as file:
            file.write(text)
            print(f'Saved to {directory}/{file_name}.txt')


def _getPDFContent(domain_name: str, pdf_link: str):
    response = requests.get(pdf_link)
    f = io.BytesIO(response.content)
    reader = PyPDF2.PdfReader(f)
    pages = reader.pages
    text = f"{pdf_link}\n"
    content_text = "".join([page.extract_text() for page in pages])
    text += content_text
    
    base_path = os.path.dirname(__file__)
    directory = os.path.join(base_path, "data_ingress", domain_name, "webpage")
    create_directory(directory)

    directory_len = len([f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))])
    file_name = f'pdf_{directory_len}'
    _saveToTextFile(text, directory, file_name)

def _getPDFLink(page_source: str) -> list:
    # Regular expression to find all href attributes ending with .pdf
    pdf_links = re.findall(r'href=[\'"]?([^\'" >]+\.pdf)', page_source)
    return pdf_links

def _getLinks(page_source: str) -> list:
    # Regular expression to find all href attributes
    links = re.findall(r'href=[\'"]?([^\'" >]+)', page_source)
    return links

def _getMainHTMLContent(page_source: str) -> str:
    readability_doc = Document(page_source)
    return readability_doc.summary()

def _getParsedContent(main_html_content: str) -> str:
    converter = HTML2Text()
    converter.ignore_links = False
    converter.ignore_images = True
    return converter.handle(main_html_content)