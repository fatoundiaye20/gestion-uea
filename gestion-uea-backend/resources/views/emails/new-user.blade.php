<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Vos identifiants ISEP-Thiès</title>
</head>
<body>
    <h1>Bienvenue à ISEP-Thiès</h1>
    
    <p>Bonjour {{ $user->name }},</p>
    
    <p>Votre compte a été créé avec succès sur la plateforme de gestion des UEA.</p>
    
    <p><strong>Vos identifiants :</strong></p>
    <ul>
        <li><strong>Email :</strong> {{ $user->email }}</li>
        <li><strong>Mot de passe temporaire :</strong> {{ $password }}</li>
        <li><strong>Rôle :</strong> {{ ucfirst($user->role) }}</li>
    </ul>
    
    <p><strong>⚠️ Important :</strong> Veuillez changer votre mot de passe lors de votre première connexion.</p>
    
    <p>Accédez à la plateforme : <a href="http://localhost:3000">http://localhost:3000</a></p>
    
    <p>Cordialement,<br>
    L'équipe ISEP-Thiès</p>
</body>
</html>