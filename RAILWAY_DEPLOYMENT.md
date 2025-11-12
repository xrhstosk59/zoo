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

1. Στο Railway, πάτα στο **MySQL service**
2. Πήγαινε στο tab **"Connect"**
3. Αντίγραψε τη **MySQL Connection URL**
4. Χρησιμοποίησε ένα MySQL client για import:

### Με TablePlus / MySQL Workbench / DBeaver:
- Σύνδεση με τα Railway MySQL credentials
- Import το αρχείο `zwologikos_khpos.sql`

### Με Railway CLI:
```bash
# Εγκατάσταση
npm i -g @railway/cli

# Login και link project
railway login
railway link

# Connect στη βάση
railway connect MySQL

# Import
source zwologikos_khpos.sql
```

## Βήμα 4: Ρυθμίσεις Environment Variables

Το Railway **αυτόματα** δημιουργεί τα MySQL variables.

Στο **PHP service** → **Variables**, πρόσθεσε:
```
DB_HOST=${{MySQL.MYSQLHOST}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
```

## Βήμα 5: Deploy

1. Push στο GitHub:
```bash
git push
```

2. Το Railway θα κάνει auto-deploy

3. Ανοιξε το deployment URL για test

---

## Local Development με XAMPP

Το project δουλεύει αυτόματα τοπικά με:
- Host: `localhost`
- Username: `root`
- Password: `` (κενό)
- Database: `zwologikos_khpos`

---

## Κόστος Railway

- **Starter Plan**: $5 credit/μήνα (free)
- **MySQL**: ~$5/μήνα
- **PHP hosting**: Free με credits

---

## Troubleshooting

### Δεν συνδέεται η βάση:
1. Έλεγξε τα Variables στο Railway
2. Δες τα Logs: PHP service → "Logs"

### Δεν βλέπω δεδομένα:
1. Σύνδεσου στο Railway MySQL
2. Τρέξε: `SHOW TABLES;`
3. Αν είναι άδεια, ξανακάνε import
