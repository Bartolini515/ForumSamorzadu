import os
import requests
from bs4 import BeautifulSoup
import json

def get_urls(main_url):
    response = requests.get(main_url)
    response.encoding = 'utf-8'  # Ensure proper encoding
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find the first list (ul or ol)
    classes_list = soup.find("ul") 
    if not classes_list:
        raise ValueError("Nie znaleziono listy na stronie.")

    urls = []
    class_names = []
    
    for link in classes_list.find_all("a", href=True):
        urls.append(link['href'])
        class_names.append(link.text.strip())
    
    return urls, class_names
    

def get_class_schedule(url, class_name):
    response = requests.get(url)
    response.encoding = 'utf-8'  # Ensure proper encoding
    soup = BeautifulSoup(response.text, 'html.parser')

    table = soup.find("table", {"class": "tabela"})
    if not table:
        raise ValueError("Nie znaleziono tabeli z planem lekcji.")
    days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"]
    schedule = []

    rows = table.find_all("tr")[1:]  # Skip header row
    if not rows:
        raise ValueError("Nie znaleziono wierszy w tabeli z planem lekcji.")
    

    for day_index in range(5):  # 5 school days
        day_data = {
            "day": days[day_index],
            "lessons": []
        }
        
        
        for index, row in enumerate(rows, start=1):
            cells = row.find_all("td")
            lesson_cell = cells[day_index + 2]

            entries = []
            for lesson in lesson_cell.find_all("span", class_="p"):
                subject = lesson.text.strip()  # Extract subject name

                # Find teacher and room within the same <td>
                teacher_tag = lesson.find_next("a", class_="n")
                room_tag = lesson.find_next("a", class_="s")

                teacher = teacher_tag.text.strip() if teacher_tag else "Unknown"
                room = room_tag.text.strip() if room_tag else "Unknown"

                entry = {
                    "subject": subject,
                    "teacher": teacher,
                    "room": room
                }

                # Optional: detect group info in subject (e.g., "j.angielski-1/2")
                if "-" in subject and "/" in subject:
                    entry["group"] = subject.split("-")[-1]
                    entry["subject"] = subject.split("-")[0].strip()

                entries.append(entry)

            if entries:
                day_data["lessons"].append({
                    "lesson_number": index,
                    "entries": entries
                })

        schedule.append(day_data)

    return {
        class_name: schedule
    }

def schedule_scrapper_main(main_url):
    data = {}
    try:
        urls, class_names = get_urls(f"{main_url}/lista.html")
    except ValueError as e:
        return False, str(e)
    
    for url, class_name in zip(urls, class_names):
        full_url = f"{main_url}/{url}"
        try:
            data.update(get_class_schedule(full_url, class_name))
        except ValueError as e:
            return False, str(e)
        
    script_dir = os.path.dirname(__file__)
    if not os.path.exists(os.path.join(script_dir, "..", "data")):
        os.makedirs(os.path.join(script_dir, "..", "data"))
    json_path = os.path.join(script_dir, "..", "data", "schedule.json")
    try:
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except IOError as e:
        return False, f"Nie można zapisać pliku JSON: {e}"
    except Exception as e:
        return False, f"Wystąpił nieoczekiwany błąd: {e}"
    
    return True, 'Stworzono plan lekcji'