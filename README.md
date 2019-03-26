# project-lvl3-s382
<a href="https://codeclimate.com/github/svyborov/project-lvl3-s394/maintainability"><img src="https://api.codeclimate.com/v1/badges/193ebcfe5e2fa3b85620/maintainability" /></a>
<a href="https://codeclimate.com/github/svyborov/project-lvl3-s394/test_coverage"><img src="https://api.codeclimate.com/v1/badges/193ebcfe5e2fa3b85620/test_coverage" /></a>
[![Build Status](https://travis-ci.org/svyborov/project-lvl3-s394.svg?branch=master)](https://travis-ci.org/svyborov/project-lvl3-s394)

В рамках данного проекта была реализована утилита для скачивания указанного адреса из сети. Принцип ее работы очень похож на то, что делает браузер при сохранении страниц сайтов.

Возможности утилиты:
- Можно указать папку, в которую нужно положить готовый файл
- Утилита скачивает все ресурсы указанные на странице и меняет страницу так, что начинает ссылаться на локальные версии

## Install

```bash
$ npm install page-loader-by-vsa
```
## Usage

```bash
$ pageloader --output /var/tmp https://hexlet.io/courses

✔ https://ru.hexlet.io/lessons.rss
✔ https://ru.hexlet.io/assets/application.css
✔ https://ru.hexlet.io/assets/favicon.ico
✔ https://ru.hexlet.io/assets/favicon-196x196.png
✔ https://ru.hexlet.io/assets/favicon-96x96.png
✔ https://ru.hexlet.io/assets/favicon-32x32.png
✔ https://ru.hexlet.io/assets/favicon-16x16.png
✔ https://ru.hexlet.io/assets/favicon-128.png

Page was downloaded as 'ru-hexlet-io-courses.html'
```
## Example

[![asciicast](https://asciinema.org/a/afTGiZSku61KeQkETsiOelyaN.svg)](https://asciinema.org/a/afTGiZSku61KeQkETsiOelyaN)
