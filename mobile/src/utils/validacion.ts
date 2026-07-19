// Validación de formularios de autenticación, extraída de LoginScreen y
// RegisterScreen. Devuelve un mensaje de error (string) o null si es válido,
// igual que las condiciones que antes vivían inline en cada handleSubmit.

export type LoginForm = { correo: string; contrasena: string };

export function validarLogin(form: LoginForm): string | null {
  if (!form.correo || !form.contrasena) return 'Completá todos los campos';
  return null;
}

export type RegisterForm = {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  confirmar: string;
  aceptado: boolean;
};

export function validarRegistro(form: RegisterForm): string | null {
  if (!form.nombre || !form.apellido || !form.correo || !form.contrasena || !form.confirmar) {
    return 'Completá todos los campos';
  }
  if (form.contrasena !== form.confirmar) return 'Las contraseñas no coinciden';
  if (!form.aceptado) return 'Debés aceptar los términos y condiciones';
  return null;
}
