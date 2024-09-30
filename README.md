# nodejs-dbgen
Данная утилита сделана для тестирования и тренировки выполнения SQL запросов для базы данных Postgres. Её нужно использовать совместно с придуманными мною задачами на сайте [knowt.com](https://knowt.com/flashcards/8ccb3fe7-6631-4ded-9c58-fceb50b666da). Данный тренажёр пока включает в себя 69 задач на 30.09.2024 г. Я планирую расширять этот список, добавив как можно более экзотических вещей, которые можно выполнять с БД.

С помощью этой утилиты вы можете синтезировать какое угодно количество данных, изменив config.yaml. (Если у вас мало место на диске, то будьте осторожны :D)

Почему не использовать уже готовые сервисы для такого типа LeetCode? Вряд ли они позволят вам тестировать свои гипотизы на таблицах с более чем 10 000 000
записей. Так вы сможете безопасно ломать эту базу и на практике убедится как оптимизировать запросы.

![image](https://github.com/user-attachments/assets/1e3dc209-d1e6-46cd-9356-ce0945fbcfb2)

# Чтобы этим пользоваться вам понадобится 
## Создать тестовый image pg в докере
```bash
$ docker run --name testdb --env-file .env -p 5432:5432 -d postgres:latest
```
##
