# Σύστημα Διαχείρισης Ζωολογικού Κήπου 🦁

Ένα ολοκληρωμένο web-based σύστημα διαχείρισης για ζωολογικούς κήπους, αναπτυγμένο ως εργασία εξαμήνου στο τμήμα Πληροφορικής.

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
- Web Server (Apache/Nginx)
- PHP 7.4 ή νεότερη έκδοση
- MySQL 5.7+ ή MariaDB 10.2+
- Browser με υποστήριξη ES6 modules

### Βήματα Εγκατάστασης

1. **Clone το repository**
   ```bash
   git clone <repository-url>
   cd zoo
   ```

2. **Δημιούργησε τη βάση δεδομένων**
   ```sql
   CREATE DATABASE student_2410 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Import το database schema**
   ```bash
   mysql -u username -p student_2410 < database/schema.sql
   ```
   *(Σημείωση: Το schema file πρέπει να δημιουργηθεί από το υπάρχον database)*

4. **Ρύθμιση Configuration**
   ```bash
   cp config.example.php config.php
   ```
   Άνοιξε το `config.php` και συμπλήρωσε τα στοιχεία της βάσης δεδομένων σου:
   ```php
   'database' => [
       'host' => 'localhost',
       'username' => 'your_username',
       'password' => 'your_password',
       'database' => 'your_database',
       'charset' => 'utf8mb4'
   ]
   ```

5. **Ρύθμιση Web Server**

   Βεβαιώσου ότι το document root δείχνει στον φάκελο του project.

   **Apache (.htaccess)**
   ```apache
   RewriteEngine On
   RewriteBase /
   ```

   **Nginx**
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

6. **Άνοιξε στο browser**
   ```
   http://localhost/zoo
   ```

## 🗂️ Δομή Project

```
zoo/
├── EIDOS/              # Διαχείριση ειδών ζώων
│   ├── add_eidos.php
│   ├── update_eidos.php
│   ├── delete_eidos.php
│   └── eidos.js
├── EISITIRIO/          # Διαχείριση εισιτηρίων
├── EKDILOSI/           # Διαχείριση εκδηλώσεων
├── TAMIAS/             # Διαχείριση ταμιών
├── ZWO/                # Διαχείριση ζώων
├── episkeptis/         # Διαχείριση επισκεπτών
├── frontistis/         # Διαχείριση φροντιστών
├── promitheutis/       # Διαχείριση προμηθευτών
├── config.example.php  # Configuration template
├── config.php          # Configuration file (gitignored)
├── db_connection.php   # Database connection class
├── db.php              # API endpoint για data fetching
├── index.html          # Main HTML file
├── script.js           # Main JavaScript module
├── style.css           # Stylesheet
└── ValidationFunctions.js  # Validation utilities
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

1. **ΜΗΝ κάνεις commit** το αρχείο `config.php`
2. **Άλλαξε τον κωδικό** της βάσης δεδομένων αν ήταν exposed
3. **Χρησιμοποίησε HTTPS** σε production environment
4. **Ενεργοποίησε production mode** στο config.php όταν το deploy

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
- Βεβαιώσου ότι το `config.php` έχει τα σωστά credentials
- Έλεγξε ότι ο web server τρέχει

### Database connection error
- Επιβεβαίωσε ότι η MySQL service τρέχει
- Έλεγξε τα credentials στο `config.php`
- Βεβαιώσου ότι η βάση δεδομένων έχει δημιουργηθεί

### Module import errors
- Βεβαιώσου ότι ο browser υποστηρίζει ES6 modules
- Έλεγξε ότι τα paths στα imports είναι σωστά
- Χρησιμοποίησε web server (όχι file://)

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

- ✅ Μετακίνηση credentials σε configuration file
- ✅ Προσθήκη .gitignore
- ✅ Security improvements
- ✅ Διόρθωση hardcoded paths
- ✅ Προσθήκη comprehensive documentation

## ⭐ Contributing

Για προτάσεις βελτιώσεων, άνοιξε ένα issue ή κάνε pull request.

---

**Σημείωση**: Πριν κάνεις deploy σε production environment, βεβαιώσου ότι έχεις:
1. Αλλάξει όλους τους default κωδικούς
2. Ενεργοποιήσει HTTPS
3. Ρυθμίσει το environment σε 'production' στο config.php
4. Ελέγξει όλα τα security settings
