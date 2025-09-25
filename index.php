<?php
require_once 'koneksi.php';

// Jika sudah login, redirect ke dashboard
if (isset($_SESSION['admin_id'])) {
    header("Location: admin_dashboard.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aplikasi Penjualan Barang</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Aplikasi Penjualan Barang</h1>
        </header>
        
        <div class="card">
            <h2>Selamat Datang</h2>
            <p>Silakan pilih menu di bawah ini:</p>
            
            <div class="menu-buttons">
                <a href="admin_login.php" class="btn btn-primary">
                    <i class="fas fa-user-shield"></i> Login Admin
                </a>
                <a href="pos.php" class="btn btn-success">
                    <i class="fas fa-cash-register"></i> Kasir/POS
                </a>
            </div>
        </div>
        
        <footer>
            <p>&copy; <?php echo date('Y'); ?> Aplikasi Penjualan Barang</p>
        </footer>
    </div>
</body>
</html>