# راست‌چین فارسی Codex برای VS Code

افزونه‌ای غیررسمی برای راست‌چین‌کردن رابط افزونهٔ رسمی Codex در VS Code و استفاده از فونت Vazirmatn.

[English documentation](README.md)

## امکانات

- راست‌چین‌کردن رابط Codex و کادر نوشتن پیام
- فونت Vazirmatn داخلی برای متن فارسی و لاتین
- حفظ حالت چپ‌چین و فونت monospace برای کد و diff
- تنظیم اندازهٔ فونت و جهت ورودی‌ها
- بازگردانی کامل تغییرات با یک فرمان
- بدون دریافت فونت از اینترنت و بدون جمع‌آوری اطلاعات کاربر

## نصب

فایل `.vsix` آخرین نسخه را از بخش Releases دریافت و نصب کنید:

```powershell
code --install-extension .\codex-rtl-vazirmatn-0.2.0.vsix
```

سپس Command Palette را با `Ctrl+Shift+P` باز کنید و فرمان زیر را اجرا کنید:

```text
Codex RTL: Enable RTL and Vazirmatn
```

در پایان گزینهٔ **Reload Window** را انتخاب کنید.

## فرمان‌ها

- `Codex RTL: Enable RTL and Vazirmatn` — فعال‌سازی یا اعمال دوبارهٔ تغییرات
- `Codex RTL: Disable and Restore Original Styles` — حذف تغییرات و بازگردانی ظاهر اصلی
- `Codex RTL: Show Status` — نمایش وضعیت فعلی

## نکتهٔ سازگاری

به‌دلیل جدابودن WebViewهای VS Code، این ابزار یک بلوک CSS نشان‌گذاری‌شده و قابل‌بازگشت را به فایل‌های افزونهٔ Codex اضافه می‌کند. پس از به‌روزرسانی Codex باید فرمان فعال‌سازی را دوباره اجرا کنید. همچنین ممکن است VS Code به‌دلیل تغییر فایل‌های افزونه هشدار integrity نمایش دهد.

این پروژه مستقل است و وابستگی یا تأیید رسمی از طرف OpenAI ندارد.
