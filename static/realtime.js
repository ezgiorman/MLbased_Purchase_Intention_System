function rand(min, max, dec) {
    dec = dec || 0;
    var f = Math.pow(10, dec);
    return Math.round((Math.random() * (max - min) + min) * f) / f;
}

// Mobile menu
var menuBtn = document.getElementById('mobileMenuBtn');
if (menuBtn) {
    menuBtn.addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('open');
    });
}

// Weekend toggle
var weekendToggle = document.getElementById('weekendToggle');
var isWeekend = false;
if (weekendToggle) {
    weekendToggle.addEventListener('click', function() {
        isWeekend = !isWeekend;
        weekendToggle.classList.toggle('active', isWeekend);
        weekendToggle.setAttribute('aria-checked', isWeekend);
    });
}

// Locale-safe number reader
function getNum(id, fallback) {
    var el = document.getElementById(id);
    if (!el) return fallback;
    var v = el.valueAsNumber;
    if (isNaN(v)) {
        v = Number(el.value.replace(',', '.'));
    }
    return isNaN(v) ? fallback : v;
}

// Mock table
function renderMockTable(count) {
    count = count || 20;
    var tbody = document.getElementById('recent-predictions-body');
    console.log('renderMockTable called, tbody=', tbody);
    if (!tbody) { console.error('tbody NOT FOUND!'); return; }
    tbody.innerHTML = '';
    var months = ['Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    var visitors = ['Devamlı', 'Yeni', 'Diğer'];
    for (var i = 0; i < count; i++) {
        var proba = rand(0.03, 0.95, 3);
        var label = proba >= 0.5 ? 1 : 0;
        var month = months[Math.floor(Math.random() * months.length)];
        var visitor = visitors[Math.floor(Math.random() * visitors.length)];
        var pageVal = rand(0, 350, 1);
        var exitRate = rand(0.05, 0.8, 3);
        var sid = 'S' + String(100000 + Math.floor(Math.random() * 900000));
        var chipClass = label ? 'chip-positive' : 'chip-negative';
        var chipText = label ? '✓ Satın alır' : '✕ Almaz';
        var fillClass = proba >= 0.5 ? 'high' : 'low';
        var fillWidth = (proba * 100).toFixed(1);
        var probaColor = proba >= 0.5 ? '#16a34a' : 'var(--red)';
        var tr = document.createElement('tr');
        tr.style.animation = 'fadeSlideUp ' + (0.2 + i * 0.03) + 's ease-out both';
        tr.innerHTML = '<td style="font-weight:600;color:var(--text-primary);font-family:monospace;font-size:12px">' + sid + '</td>' +
            '<td>' + month + ' · ' + visitor + '</td>' +
            '<td><span class="chip ' + chipClass + '">' + chipText + '</span></td>' +
            '<td><div class="proba-bar"><div class="proba-track"><div class="proba-fill ' + fillClass + '" style="width:' + fillWidth + '%"></div></div><span class="proba-text" style="color:' + probaColor + '">' + fillWidth + '%</span></div></td>' +
            '<td>' + pageVal.toFixed(1) + '</td>' +
            '<td>' + (exitRate * 100).toFixed(1) + '%</td>';
        tbody.appendChild(tr);
    }
    console.log('Table rendered, rows:', tbody.children.length);
}

// Prediction form
var form = document.getElementById('predictForm');
var btnPredict = document.getElementById('btnPredict');
var resultCard = document.getElementById('resultCard');
var errorText = document.getElementById('errorText');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        errorText.classList.remove('visible');
        errorText.textContent = '';
        btnPredict.classList.add('loading');
        btnPredict.disabled = true;
        var payload = {
            Administrative: getNum('f-admin', 0),
            Administrative_Duration: getNum('f-admin-dur', 0),
            Informational: getNum('f-info', 0),
            Informational_Duration: getNum('f-info-dur', 0),
            ProductRelated: getNum('f-prod', 0),
            ProductRelated_Duration: getNum('f-prod-dur', 0),
            BounceRates: getNum('f-bounce', 0),
            ExitRates: getNum('f-exit', 0),
            PageValues: getNum('f-page', 0),
            SpecialDay: getNum('f-special', 0),
            Month: document.getElementById('f-month').value,
            OperatingSystems: getNum('f-os', 2),
            Browser: getNum('f-browser', 2),
            Region: getNum('f-region', 1),
            TrafficType: getNum('f-traffic', 2),
            VisitorType: document.getElementById('f-visitor').value,
            Weekend: isWeekend
        };
        console.log('Sending payload:', JSON.stringify(payload));
        fetch('/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            .then(function(res) {
                if (!res.ok) throw new Error('API hatası: ' + res.status);
                return res.json();
            })
            .then(function(data) {
                var proba = data.purchase_probability;
                var label = data.predicted_label;
                var pos = label === 1;
                resultCard.classList.add('visible');
                document.getElementById('resultIcon').textContent = pos ? '✅' : '❌';
                document.getElementById('resultIcon').style.background = pos ? 'var(--green-soft)' : 'var(--red-soft)';
                document.getElementById('resultLabel').textContent = pos ? 'Satın Alır' : 'Satın Almaz';
                document.getElementById('resultLabel').style.color = pos ? '#16a34a' : 'var(--red)';
                var fill = document.getElementById('resultFill');
                fill.style.width = (proba * 100) + '%';
                fill.style.background = pos ? 'linear-gradient(90deg,var(--teal),var(--green))' : 'linear-gradient(90deg,var(--coral),var(--red))';
                var pv = document.getElementById('resultProba');
                pv.textContent = (proba * 100).toFixed(2) + '%';
                pv.style.color = pos ? '#16a34a' : 'var(--red)';
            })
            .catch(function(err) {
                errorText.textContent = 'Hata: ' + err.message;
                errorText.classList.add('visible');
            })
            .finally(function() {
                btnPredict.classList.remove('loading');
                btnPredict.disabled = false;
            });
    });
}

// Render table immediately
renderMockTable();
