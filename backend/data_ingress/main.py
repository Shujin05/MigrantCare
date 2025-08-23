from zig_scraper import generateRow 
import logging

logger = logging.getLogger(__name__) 
urls_to_search = ["https://www.mom.gov.sg"]

# unique to elitigation.sg page, other pages just put base_url
base_url = "https://www.mom.gov.sg"
domain_name = 'mom.gov.sg'
urls_to_search.append(base_url)

def _getURL(base_url: str) -> list:
    return [base_url]

scraped_links = []
counter = 0
for url in urls_to_search:
    all_links = _getURL(url)
    for link in all_links:
        if link in scraped_links:
            continue
        try:
            scraped_link_by_url = generateRow(scraped_links, logger, link, domain_name)
            for link in scraped_link_by_url:
                if link not in scraped_links:
                    print(link)
                    scraped_links.append(link)
            counter += 1
        
            print(f'Completed scraping {link}')
            print(f'Currently Completed: {counter}/{len(all_links)} links.')
        except Exception as e:
            print(f'Error scraping {link}, error: {e}')
            continue