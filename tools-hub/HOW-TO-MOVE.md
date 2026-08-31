<div dir="rtl">

# העתק גיבוי

התיקייה הזאת היא אתר עצמאי שנבנה כאן זמנית, כי לא הייתה לי הרשאה ליצור ריפו
חדש. המקום הקבוע שלו הוא ריפו נפרד בשם `tools`, כדי שהכתובת של מרכז הכלים לא
תהיה תת־נתיב של אחד הכלים.

להעברה, אחרי יצירת ריפו ציבורי ריק בשם `tools`:

</div>

```bash
git clone https://github.com/elibic/tools && cd tools
cp -r ../habit-chart/tools-hub/. .
rm HOW-TO-MOVE.md
git add -A && git commit -m "מרכז כלים" && git push
```

<div dir="rtl">

ואז `Settings → Pages → Deploy from a branch → main / (root)`. אחרי ההעברה
אפשר למחוק את התיקייה הזאת מ-habit-chart.

</div>
