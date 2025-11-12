# Οδηγίες για Railway Deployment

## Βήμα 1: Δημιουργία Railway Project

1. Πήγαινε στο [railway.app](https://railway.app)
2. Κάνε εγγραφή/σύνδεση με GitHub
3. Πάτα **"New Project"**
4. Επίλεξε **"Deploy from GitHub repo"**
5. Επίλεξε το repository `zoo`

## Βήμα 2: Προσθήκη MySQL Database

1. Μέσα στο Railway project, πάτα **"+ New"**
2. Επίλεξε **"Database"**
3. Επίλεξε **"Add MySQL"**
4. Περίμενε να φορτώσει (1-2 λεπτά)

## Βήμα 3: Import της Βάσης Δεδομένων

### Επιλογή Α: Με MySQL Command Line (Προτεινόμενο)

```bash
# Εγκατάσταση MySQL client (αν δεν το έχεις)
brew install mysql-client  # macOS
# ή
apt-get install mysql-client  # Linux

# Import της βάσης
mysql -h [HOST] -P [PORT] -u [USERNAME] -p[PASSWORD] [DATABASE] < zwologikos_khpos.sql
```

**Credentials:** Θα τα βρεις στο Railway → MySQL service → "Connect" tab

### Επιλογή Β: Με Railway CLI

```bash
# Εγκατάσταση
npm i -g @railway/cli

# Login και link project
railway login
railway link

# Connect στη βάση
railway connect MySQL

# Import (μέσα στο MySQL shell)
source zwologikos_khpos.sql
```

### Επιλογή Γ: Με GUI Tool (TablePlus/MySQL Workbench)

1. Κατέβασε **TablePlus** (free): https://tableplus.com
2. New connection → MySQL
3. Βάλε τα credentials από το Railway
4. Connect και import το `zwologikos_khpos.sql`

## Βήμα 4: Ρυθμίσεις Environment Variables

Το Railway **αυτόματα** προτείνει τα MySQL variables!

1. Πήγαινε στο **zoo service** (όχι το MySQL)
2. Tab **"Variables"**
3. Θα δεις "Suggested Variables" με:
   - `DB_HOST` → `MySQL.MYSQLHOST`
   - `DB_USERNAME` → `MySQL.MYSQLUSER`
   - `DB_PASSWORD` → `MySQL.MYSQLPASSWORD`
   - `DB_DATABASE` → `MySQL.MYSQLDATABASE`
4. Πάτα το κουμπί **"Add"**

Αυτό θα κάνει auto-redeploy το app με τις σωστές ρυθμίσεις!

## Βήμα 5: Deploy & Test

1. Μετά την προσθήκη των variables, το Railway κάνει αυτόματα deploy
2. Περίμενε 1-2 λεπτά για το deployment
3. Πάτα στο deployment URL για να δεις την εφαρμογή

**URL Format:** `https://zoo-production.up.railway.app`

## Troubleshooting

### Δεν συνδέεται η βάση

1. Έλεγξε τα Variables: Railway → zoo service → "Variables"
2. Βεβαιώσου ότι όλα τα 4 variables είναι ορισμένα
3. Δες τα Logs: Railway → zoo service → "Logs"

**Κοινό Error:**
```
Database connection error
```
**Λύση:** Επιβεβαίωσε ότι τα MySQL variables έχουν προστεθεί

### Δεν βλέπω δεδομένα

1. Σύνδεσου στο Railway MySQL με TablePlus
2. Τρέξε: `SHOW TABLES;`
3. Αν δεν υπάρχουν πίνακες, ξανακάνε import
4. Έλεγξε: `SELECT COUNT(*) FROM zwo;` (πρέπει να δείξει 65+)

### Import Errors

**Error: "Foreign key constraint"**
- Η βάση έχει foreign keys που μπορεί να προκαλέσουν θέματα
- Χρησιμοποίησε την προετοιμασμένη έκδοση χωρίς FKs

**Error: "Table already exists"**
- Drop και recreate τη βάση:
```sql
DROP DATABASE IF EXISTS railway;
CREATE DATABASE railway CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE railway;
```

### Railway Service Won't Start

1. Έλεγξε τα Logs για specific errors
2. Βεβαιώσου ότι το PHP version είναι 7.4+
3. Επιβεβαίωσε ότι όλα τα αρχεία έχουν push στο GitHub

---

## Local Development

Για να δουλεύει τοπικά με XAMPP:

```bash
# Δεν χρειάζεται .env αρχείο!
# Το db_connection.php χρησιμοποιεί αυτόματα:
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=zwologikos_khpos
```

Απλά βεβαιώσου ότι:
- Το XAMPP τρέχει Apache + MySQL
- Η βάση `zwologikos_khpos` υπάρχει
- Τα δεδομένα έχουν import

---

## Κόστος Railway

- **Starter Plan**: $5 credit/μήνα (free)
- **MySQL**: ~$5/μήνα
- **PHP hosting**: Καλύπτεται από τα credits

Αν τελειώσουν τα credits:
- **Hobby Plan**: $5/μήνα

---

## Χρήσιμα Links

- **Railway Docs**: https://docs.railway.app
- **MySQL CLI Docs**: https://dev.mysql.com/doc/refman/8.0/en/mysql.html
- **TablePlus**: https://tableplus.com
- **Project GitHub**: https://github.com/xrhstosk59/zoo

---

**Tip:** Κράτα το `zwologikos_khpos.sql` ενημερωμένο για backups!
```bash
mysqldump -h HOST -P PORT -u USER -pPASSWORD DATABASE > backup_$(date +%Y%m%d).sql
```
