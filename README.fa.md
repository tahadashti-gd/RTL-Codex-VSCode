# راست‌چین فارسی Codex برای VS Code

[![CI](https://github.com/TahaDashti/codex-rtl-vazirmatn/actions/workflows/ci.yml/badge.svg)](https://github.com/TahaDashti/codex-rtl-vazirmatn/actions/workflows/ci.yml)
[![مجوز MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vazirmatn: OFL-1.1](https://img.shields.io/badge/Vazirmatn-OFL--1.1-green.svg)](THIRD_PARTY_NOTICES.md)

یک افزونهٔ جانبی و غیررسمی که چیدمان راست‌به‌چپ و فونت [Vazirmatn](https://github.com/rastikerdar/vazirmatn) را به افزونهٔ رسمی Codex در Visual Studio Code اضافه می‌کند.

[English documentation](README.md)

## امکانات

- راست‌چین‌کردن رابط Codex و کادر نوشتن پیام
- فونت متغیر Vazirmatn داخلی برای متن فارسی، عربی و لاتین
- حفظ حالت چپ‌به‌راست برای بلوک‌های کد، diff و محتوای ویرایشگر
- امکان تنظیم اندازهٔ فونت و جهت کادرهای ورودی
- بازگردانی کامل تغییرات با فرمان اختصاصی
- بدون دریافت فونت از اینترنت، telemetry یا جمع‌آوری اطلاعات کاربر

## پیش‌نیازها

- Visual Studio Code نسخهٔ 1.90 یا جدیدتر
- افزونهٔ رسمی Codex با شناسهٔ `openai.chatgpt`

## نصب

آخرین فایل `.vsix` را از بخش [GitHub Releases](https://github.com/TahaDashti/codex-rtl-vazirmatn/releases) دریافت و فرمان زیر را اجرا کنید:

```powershell
code --install-extension .\codex-rtl-vazirmatn-0.2.0.vsix
```

روش دیگر این است که در VS Code وارد بخش Extensions شوید، منوی سه‌نقطه را باز کنید، گزینهٔ **Install from VSIX...** را بزنید و فایل دانلودشده را انتخاب کنید.

پس از نصب:

1. با فشردن `Ctrl+Shift+P` پنجرهٔ Command Palette را باز کنید.
2. فرمان `Codex RTL: Enable RTL and Vazirmatn` را اجرا کنید.
3. در پیام نمایش‌داده‌شده گزینهٔ **Reload Window** را انتخاب کنید.

## فرمان‌ها

| فرمان | توضیح |
| --- | --- |
| `Codex RTL: Enable RTL and Vazirmatn` | استایل راست‌چین و فونت داخلی را اعمال یا به‌روزرسانی می‌کند. |
| `Codex RTL: Disable and Restore Original Styles` | تغییرات افزونه و فایل‌های فونت کپی‌شده را حذف می‌کند. |
| `Codex RTL: Show Status` | فعال یا غیرفعال‌بودن تغییرات روی فایل‌های سازگار Codex را نمایش می‌دهد. |

## تنظیمات

| تنظیم | مقدار پیش‌فرض | توضیح |
| --- | ---: | --- |
| `codexRtl.fontScale` | `1` | ضریب اندازهٔ فونت از `0.8` تا `1.5`. |
| `codexRtl.rtlInputs` | `true` | جهت راست‌به‌چپ را روی کادرهای ورودی و کادر نوشتن پیام اعمال می‌کند. |

## نکتهٔ سازگاری

WebViewهای VS Code از افزونه‌های دیگر جدا هستند؛ به همین دلیل این ابزار یک بلوک CSS کوچک و مشخص را مستقیماً به فایل‌های افزونهٔ نصب‌شدهٔ Codex اضافه می‌کند. این تغییر قابل‌بازگشت است، اما به‌روزرسانی Codex معمولاً فایل‌های تغییریافته را جایگزین می‌کند. پس از هر به‌روزرسانی Codex، فرمان **Codex RTL: Enable RTL and Vazirmatn** را دوباره اجرا کنید.

ازآنجاکه فایل‌های یک افزونهٔ نصب‌شده تغییر می‌کنند، ممکن است VS Code هشدار integrity نمایش دهد. پیش از گزارش مشکلات رابط Codex به OpenAI، فرمان **Codex RTL: Disable and Restore Original Styles** را اجرا کنید.

## حریم خصوصی

این افزونه به پیام‌ها، گفتگوها، اطلاعات ورود، فایل‌های Workspace یا سرویس‌های شبکه دسترسی ندارد. تنها فایل‌های CSS سازگار را در پوشهٔ افزونهٔ نصب‌شدهٔ Codex می‌خواند و تغییر می‌دهد.

## توسعه

```powershell
npm ci
npm test
npm run package
```

برای اجرای Extension Development Host در VS Code کلید `F5` را فشار دهید. روند مشارکت در پروژه در فایل [CONTRIBUTING.md](CONTRIBUTING.md) توضیح داده شده است.

## سلب مسئولیت

این پروژه یک ابزار مستقل و جامعه‌محور است و هیچ وابستگی، تأیید یا پشتیبانی رسمی از طرف OpenAI ندارد. نام‌ها و علائم تجاری Codex، Visual Studio Code، Microsoft و OpenAI متعلق به صاحبان آن‌ها هستند.

## مجوز

کد منبع پروژه تحت [مجوز MIT](LICENSE) منتشر شده است. فونت Vazirmatn تحت مجوز SIL Open Font License 1.1 توزیع می‌شود؛ برای جزئیات فایل [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) را ببینید.
