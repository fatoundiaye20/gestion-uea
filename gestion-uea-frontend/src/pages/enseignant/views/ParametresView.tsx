import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';

type Enseignant = {
  id: number;
  name: string;
  email: string;
  telephone?: string;
  specialite?: string;
  role: string;
};

const ParametresView = () => {
  const [enseignant, setEnseignant] = useState<Enseignant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    specialite: '',
    password: '',
    confirmPassword: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchEnseignant();
  }, []);

  const fetchEnseignant = async () => {
    try {
      const data = await apiClient('/me');
      setEnseignant(data.user);
      setFormData({
        name: data.user.name || '',
        email: data.user.email || '',
        telephone: data.user.telephone || '',
        specialite: data.user.specialite || '',
        password: '',
        confirmPassword: ''
      });
      setError('');
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Le nom est obligatoire');
      return false;
    }
    if (!formData.email.trim()) {
      setError('L\'email est obligatoire');
      return false;
    }
    if (formData.password && formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      const dataToSend: any = {
        name: formData.name,
        email: formData.email,
        telephone: formData.telephone || null,
        specialite: formData.specialite || null
      };

      if (formData.password) {
        dataToSend.password = formData.password;
      }

      await apiClient(`/users/${enseignant?.id}`, {
        method: 'PUT',
        body: JSON.stringify(dataToSend)
      });

      setSuccess('Profil mis à jour avec succès');
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      fetchEnseignant();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      console.error('Erreur sauvegarde:', err);
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    fetchEnseignant();
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  }

  if (!enseignant) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Enseignant non trouvé</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: '100%',
        maxWidth: '650px',
        background: '#e6f0ff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        color: '#003366'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ margin: 0, color: '#003366' }}>
            Paramètres du Profil
          </h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: '#0077cc',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.95rem'
              }}
            >
              ✎ Modifier
            </button>
          )}
        </div>

        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            textAlign: 'center',
            border: '1px solid #f5c6cb'
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            textAlign: 'center',
            border: '1px solid #c3e6cb'
          }}>
            ✓ {success}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Nom */}
          <div>
            <label style={{
              display: 'block',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: '#003366',
              fontSize: '0.95rem'
            }}>
              Nom Complet
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #006699',
                backgroundColor: isEditing ? '#ffffff' : '#f0f0f0',
                color: '#003366',
                boxSizing: 'border-box',
                cursor: isEditing ? 'text' : 'not-allowed'
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: '#003366',
              fontSize: '0.95rem'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #006699',
                backgroundColor: isEditing ? '#ffffff' : '#f0f0f0',
                color: '#003366',
                boxSizing: 'border-box',
                cursor: isEditing ? 'text' : 'not-allowed'
              }}
            />
          </div>

          {/* Téléphone */}
          <div>
            <label style={{
              display: 'block',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: '#003366',
              fontSize: '0.95rem'
            }}>
              Téléphone
            </label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Ex: 771234567"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #006699',
                backgroundColor: isEditing ? '#ffffff' : '#f0f0f0',
                color: '#003366',
                boxSizing: 'border-box',
                cursor: isEditing ? 'text' : 'not-allowed'
              }}
            />
          </div>

          {/* Spécialité */}
          <div>
            <label style={{
              display: 'block',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: '#003366',
              fontSize: '0.95rem'
            }}>
              Spécialité
            </label>
            <input
              type="text"
              name="specialite"
              value={formData.specialite}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Ex: Informatique, Réseau..."
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #006699',
                backgroundColor: isEditing ? '#ffffff' : '#f0f0f0',
                color: '#003366',
                boxSizing: 'border-box',
                cursor: isEditing ? 'text' : 'not-allowed'
              }}
            />
          </div>

          {/* Rôle (non modifiable) */}
          <div>
            <label style={{
              display: 'block',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: '#003366',
              fontSize: '0.95rem'
            }}>
              Rôle
            </label>
            <input
              type="text"
              value={enseignant.role}
              disabled
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#f0f0f0',
                color: '#666',
                boxSizing: 'border-box',
                cursor: 'not-allowed'
              }}
            />
          </div>

          {/* Séparateur */}
          {isEditing && (
            <div style={{
              borderTop: '2px solid #0077cc',
              paddingTop: '1.5rem',
              marginTop: '0.5rem'
            }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#003366', fontSize: '1rem' }}>
                Modifier le mot de passe
              </h4>

              {/* Nouveau mot de passe */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: '#003366',
                  fontSize: '0.95rem'
                }}>
                  Nouveau mot de passe (optionnel)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimum 8 caractères"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #006699',
                    backgroundColor: '#ffffff',
                    color: '#003366',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Confirmer mot de passe */}
              <div>
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: '#003366',
                  fontSize: '0.95rem'
                }}>
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirmer le nouveau mot de passe"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #006699',
                    backgroundColor: '#ffffff',
                    color: '#003366',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          {isEditing && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#0077cc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  opacity: isSaving ? 0.7 : 1
                }}
              >
                {isSaving ? '⏳ Sauvegarde...' : '✓ Sauvegarder'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#e0e0e0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  opacity: isSaving ? 0.7 : 1
                }}
              >
                ✕ Annuler
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParametresView;