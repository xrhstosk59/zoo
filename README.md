# Σύστημα Διαχείρισης Ζωολογικού Κήπου 🦁

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://zoo-production.up.railway.app)
[![Railway](https://img.shields.io/badge/Deployed%20on-Railway-blueviolet)](https://railway.app)
[![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?logo=php)](https://www.php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)

Ένα ολοκληρωμένο web-based σύστημα διαχείρισης για ζωολογικούς κήπους, αναπτυγμένο ως εργασία εξαμήνου στο τμήμα Πληροφορικής.

**🌐 Live Demo**: [https://zoo-production.up.railway.app](https://zoo-production.up.railway.app)

## 📋 Περιγραφή

Το σύστημα παρέχει πλήρη λειτουργικότητα CRUD (Create, Read, Update, Delete) για τη διαχείριση:
- **Ζώων** - Καταγραφή και παρακολούθηση ζώων του κήπου
- **Ειδών** - Διαχείριση κατηγοριών και ειδών ζώων
- **Εκδηλώσεων** - Προγραμματισμός και διαχείριση εκδηλώσεων
- **Εισιτηρίων** - Σύστημα έκδοσης εισιτηρίων
- **Ταμιών** - Διαχείριση προσωπικού ταμείων
- **Επισκεπτών** - Καταγραφή στοιχείων επισκεπτών
- **Φροντιστών** - Διαχείριση προσωπικού φροντίδας ζώων
- **Προμηθευτών** - Καταγραφή προμηθευτών τροφίμων και υλικών

## 🚀 Τεχνολογίες

### Backend
- **PHP 7.4+** - Server-side logic
- **MySQL/MariaDB** - Βάση δεδομένων
- **MySQLi** - Database connection με prepared statements

### Frontend
- **HTML5** - Δομή σελίδας
- **CSS3** - Styling και responsive design
- **JavaScript (ES6+)** - Client-side logic με modules
- **Vanilla JS** - Χωρίς εξωτερικά frameworks

## 📦 Εγκατάσταση

### Προαπαιτούμενα
- Web Server (Apache/Nginx) ή XAMPP
- PHP 7.4 ή νεότερη έκδοση
- MySQL 5.7+ ή MariaDB 10.2+
- Browser με υποστήριξη ES6 modules

### 🚀 Quick Start με XAMPP (Local Development)

1. **Clone το repository**
   ```bash
   git clone https://github.com/xrhstosk59/zoo.git
   cd zoo
   ```

2. **Ρύθμιση XAMPP**
   - Ξεκίνα το Apache και MySQL από το XAMPP Control Panel
   - Τοποθέτησε το project στο `htdocs` folder του XAMPP

3. **Δημιούργησε τη βάση δεδομένων**
   - Άνοιξε http://localhost/phpmyadmin
   - Δημιούργησε νέα βάση: `zwologikos_khpos`
   - Import το αρχείο `zwologikos_khpos.sql` (αν το έχεις)

4. **Η εφαρμογή είναι έτοιμη!**
   ```
   http://localhost/zoo
   ```

   Το `db_connection.php` χρησιμοποιεί αυτόματα default τιμές για XAMPP:
   - Host: `localhost`
   - Username: `root`
   - Password: `` (κενό)
   - Database: `zwologikos_khpos`

### ☁️ Deployment στο Railway

Για production deployment στο Railway, δες τις αναλυτικές οδηγίες στο [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

**Σύντομα βήματα:**
1. Push το project στο GitHub
2. Σύνδεση Railway με GitHub
3. Προσθήκη MySQL service
4. Import της βάσης
5. Ρύθμιση Environment Variables
6. Auto-deploy!

### 🔧 Environment Variables

Το project υποστηρίζει environment variables για production deployments:

```env
DB_HOST=your_mysql_host
DB_USERNAME=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_DATABASE=zwologikos_khpos
```

Για local development, δεν χρειάζεται να ορίσεις τίποτα - χρησιμοποιούνται αυτόματα οι XAMPP defaults.

## 🗂️ Δομή Project

```
zoo/
├── EIDOS/                      # Διαχείριση ειδών ζώων
│   ├── add_eidos.php
│   ├── update_eidos.php
│   ├── delete_eidos.php
│   └── eidos.js
├── EISITIRIO/                  # Διαχείριση εισιτηρίων
├── EKDILOSI/                   # Διαχείριση εκδηλώσεων
├── EPISKEPTIS/                 # Διαχείριση επισκεπτών
├── FRONTISTIS/                 # Διαχείριση φροντιστών
├── PROMITHEUTIS/               # Διαχείριση προμηθευτών
├── TAMIAS/                     # Διαχείριση ταμιών
├── ZWO/                        # Διαχείριση ζώων
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── RAILWAY_DEPLOYMENT.md       # Railway deployment guide
├── db_connection.php           # Database connection με env vars
├── db.php                      # API endpoint για data fetching
├── index.html                  # Main HTML file
├── script.js                   # Main JavaScript module
├── style.css                   # Stylesheet
├── ValidationFunctions.js      # Validation utilities
└── zwologikos_khpos.sql        # Database backup (gitignored)
```

## 🔒 Ασφάλεια

Το project περιλαμβάνει:

- ✅ **Prepared Statements** - Προστασία από SQL Injection
- ✅ **Input Validation** - Client & server-side validation
- ✅ **XSS Protection** - Χρήση htmlspecialchars()
- ✅ **Transaction Management** - Data integrity
- ✅ **Error Handling** - Proper error management
- ✅ **Configuration Security** - Credentials εκτός version control

### ⚠️ Σημαντικές Σημειώσεις Ασφαλείας

1. **ΜΗΝ κάνεις commit** τα αρχεία `.env` ή `zwologikos_khpos.sql`
2. **ΜΗΝ κάνεις commit** τους κωδικούς της βάσης δεδομένων
3. **Χρησιμοποίησε HTTPS** σε production environment (Railway το κάνει αυτόματα)
4. **Χρησιμοποίησε Environment Variables** για όλα τα credentials σε production

## 🎯 Χαρακτηριστικά

### Validation
- Real-time form validation
- Regex patterns για codes (π.χ. Z000001 για ζώα)
- Email και τηλέφωνο validation
- Date και time validation

### UI/UX
- Responsive design
- Loading indicators
- Success/Error messages
- Pagination για μεγάλα datasets
- Intuitive navigation

### Database
- Transaction support
- Foreign key constraints
- Proper indexing
- UTF-8 support για ελληνικά

## 📝 Database Schema

### Κύριοι Πίνακες

- **ZWO** - Ζώα (Kodikos, Onoma, Etos_Genesis, Onoma_Eidous)
- **EIDOS** - Είδη (Onoma, Katigoria, Perigrafi)
- **EKDILOSI** - Εκδηλώσεις (Titlos, Hmerominia, Ora, Xwros)
- **EISITIRIO** - Εισιτήρια (Kodikos, Hmerominia_Ekdoshs, Typos, Timi, IDTamia, Email_Episkepti)
- **TAMIAS** - Ταμίες (ID, Onoma, Eponymo, Thlefono)
- **EPISKEPTIS** - Επισκέπτες (Email, Onoma, Eponymo, Thlefono)
- **FRONTISTIS** - Φροντιστές (ID, Onoma, Eponymo)
- **PROMITHEUTIS** - Προμηθευτές (AFM, Onoma, Thlefono)

## 🐛 Troubleshooting

### Δεν εμφανίζονται δεδομένα
- Έλεγξε το browser console για errors
- Βεβαιώσου ότι το XAMPP (Apache + MySQL) τρέχει
- Έλεγξε ότι η βάση `zwologikos_khpos` υπάρχει και έχει δεδομένα

### Database connection error (Local)
- Επιβεβαίωσε ότι το XAMPP MySQL τρέχει
- Έλεγξε ότι η βάση λέγεται `zwologikos_khpos`
- Βεβαιώσου ότι το username είναι `root` με κενό password

### Database connection error (Railway)
- Έλεγξε ότι τα Environment Variables είναι ορισμένα στο Railway
- Βεβαιώσου ότι το MySQL service τρέχει
- Δες τα Logs στο Railway για περισσότερες λεπτομέρειες

### Module import errors
- Βεβαιώσου ότι ο browser υποστηρίζει ES6 modules
- Έλεγξε ότι τα paths στα imports είναι σωστά
- Χρησιμοποίησε web server (όχι file://)

### Railway Deployment Issues
- Δες το [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) για troubleshooting tips
- Έλεγξε τα Logs: Railway → zoo service → "Logs" tab
- Επιβεβαίωσε ότι όλα τα Environment Variables έχουν οριστεί

## 📚 API Endpoints

### GET /db.php
Ανάκτηση δεδομένων με pagination

**Parameters:**
- `section` - Η ενότητα (Ζώα, Είδη, κλπ.)
- `page` - Αριθμός σελίδας (default: 1)

**Response:**
```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### POST /{module}/add_{entity}.php
Προσθήκη νέας εγγραφής

### POST /{module}/update_{entity}.php
Ενημέρωση υπάρχουσας εγγραφής

### POST /{module}/delete_{entity}.php
Διαγραφή εγγραφής

## 👨‍💻 Development

### Προσθήκη νέας λειτουργικότητας

1. Δημιούργησε τον φάκελο του module
2. Δημιούργησε τα PHP files (add, update, delete)
3. Δημιούργησε το JavaScript module
4. Πρόσθεσε το import στο `script.js`
5. Πρόσθεσε το case στα switch statements

### Code Style

- **PHP**: PSR-12 coding standard
- **JavaScript**: ES6+ με modules
- **SQL**: Πάντα prepared statements
- **HTML**: Semantic markup

## 📄 License

Αυτό το project δημιουργήθηκε για εκπαιδευτικούς σκοπούς.

## 👤 Συγγραφέας

Εργασία Εξαμήνου - Τμήμα Πληροφορικής

---

## 🔄 Recent Updates

### v2.0 - Railway Deployment Ready (2025-11-12)
- ✅ **Environment Variables Support** - Υποστήριξη για production deployments
- ✅ **Railway Deployment** - Πλήρες deployment guide
- ✅ **Database Migration** - Import στο Railway MySQL επιτυχώς
- ✅ **Updated README** - Νέες οδηγίες για XAMPP και Railway
- ✅ **Simplified Configuration** - Αυτόματη ρύθμιση για local development

### v1.0 - Initial Release
- ✅ Μετακίνηση credentials σε configuration file
- ✅ Προσθήκη .gitignore
- ✅ Security improvements
- ✅ Διόρθωση hardcoded paths
- ✅ Προσθήκη comprehensive documentation

## ⭐ Contributing

Για προτάσεις βελτιώσεων, άνοιξε ένα issue ή κάνε pull request.

---

## 🌐 Live Demo

**Production (Railway)**: [https://zoo-production.up.railway.app](https://zoo-production.up.railway.app)

Το σύστημα είναι live και λειτουργικό! 🚀

---

## 📖 Documentation

- **[README.md](./README.md)** - Αυτό το αρχείο
- **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)** - Οδηγίες για Railway deployment
- **[.env.example](./.env.example)** - Environment variables template

---

**Σημείωση**: Πριν κάνεις deploy σε production environment, βεβαιώσου ότι έχεις:
1. Ρυθμίσει τα Environment Variables στο Railway
2. Import την βάση δεδομένων στο Railway MySQL
3. Προσθέσει τα MySQL connection variables στο zoo service
4. Ελέγξει τα Logs για τυχόν errors
