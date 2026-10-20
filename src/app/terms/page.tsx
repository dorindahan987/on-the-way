export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12" dir="rtl">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900 mb-2">תקנון ותנאי שימוש</h1>
        <p className="text-zinc-500 text-sm">עודכן לאחרונה: אוקטובר 2025</p>
      </div>

      <div className="prose prose-zinc max-w-none space-y-8 text-sm leading-relaxed text-zinc-700">

        <section>
          <h2 className="text-lg font-black text-zinc-900 mb-3">1. הגדרת השירות</h2>
          <p>
            "על הדרך" (להלן: "הפלטפורמה") הינה פלטפורמה טכנולוגית המתפקדת כמתווכת בלבד בין שולחים (המעוניינים בשינוע פריטים) לבין מובילים עצמאיים (נהגים המציעים שירותי שינוע). הפלטפורמה אינה מספקת בעצמה שירותי הובלה כלשהם, ואינה מחזיקה בכלי רכב כלשהם.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-zinc-900 mb-3">2. הגבלת אחריות</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-3">
            <p className="font-bold text-amber-800 text-xs mb-1">חשוב לקריאה</p>
            <p className="text-amber-700">הפלטפורמה פועלת כמתווך טכנולוגי בלבד. היא אינה אחראית ואינה תהיה אחראית לכל נזק ישיר, עקיף, תוצאתי או אחר, לרבות נזקי רכוש, שיכול להיגרם במהלך או בעקבות ביצוע ההובלה.</p>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-zinc-600">
            <li>הפלטפורמה אינה אחראית לנזק לפריטים שנשלחו</li>
            <li>הפלטפורמה אינה אחראית לעיכובים במועדי הובלה</li>
            <li>הפלטפורמה אינה אחראית להתנהגות המובילים</li>
            <li>הסכם ההובלה נערך ישירות בין השולח למוביל בלבד</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-black text-zinc-900 mb-3">3. אימות מובילים</h2>
          <p>
            הפלטפורמה מבצעת תהליך אימות בסיסי למובילים הכולל בדיקת תעודת זהות ורישיון נהיגה תקף. מובילים שעברו אימות יקבלו תג "נהג מאומת ✓". עם זאת, האימות אינו מהווה ערובה לאיכות השירות, ואינו גורע מאחריות המוביל על פי כל דין.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-zinc-900 mb-3">4. מודל התשלום</h2>
          <p className="mb-3">תשלום בפלטפורמה מתחלק לשני שלבים:</p>
          <div className="space-y-2">
            <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-start gap-3">
              <span className="text-xl">🔒</span>
              <div>
                <p className="font-bold text-zinc-900 text-sm">דמי שריון — ₪35</p>
                <p className="text-zinc-500 text-xs mt-0.5">משולמים לפלטפורמה בעת נעילת ההובלה. כולל עמלת השירות ומגן כנגד ביטולים.</p>
              </div>
            </div>
            <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-start gap-3">
              <span className="text-xl">💵</span>
              <div>
                <p className="font-bold text-zinc-900 text-sm">תשלום למוביל — לפי הצעת המחיר</p>
                <p className="text-zinc-500 text-xs mt-0.5">משולם ישירות למוביל בעת האיסוף. במזומן או בהעברה בנקאית.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-black text-zinc-900 mb-3">5. מדיניות ביטול</h2>
          <ul className="list-disc list-inside space-y-1.5 text-zinc-600">
            <li>ביטול עד 24 שעות לפני מועד האיסוף — החזר מלא של דמי השריון</li>
            <li>ביטול בפחות מ-24 שעות — דמי השריון אינם מוחזרים</li>
            <li>ביטול על ידי המוביל — החזר מלא ואוטומטי לשולח</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-black text-zinc-900 mb-3">6. פרטיות ומידע אישי</h2>
          <p>
            מספרי הטלפון ופרטי הקשר של המובילים נחשפים לשולחים בלבד לאחר נעילת ההובלה ותשלום דמי השריון. הפלטפורמה לא תמסור פרטים אישיים לצדדים שלישיים, למעט כנדרש על פי חוק.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-zinc-900 mb-3">7. יצירת קשר</h2>
          <p>לשאלות ותלונות: <a href="mailto:support@ontheway.co.il" className="text-primary font-semibold underline">support@ontheway.co.il</a></p>
        </section>

      </div>
    </div>
  );
}
