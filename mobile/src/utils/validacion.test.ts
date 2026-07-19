import { validarLogin, validarRegistro } from './validacion';

describe('validarLogin', () => {
  it('rechaza si falta el correo', () => {
    expect(validarLogin({ correo: '', contrasena: 'clave123' })).toBe('Completá todos los campos');
  });
  it('rechaza si falta la contraseña', () => {
    expect(validarLogin({ correo: 'a@b.com', contrasena: '' })).toBe('Completá todos los campos');
  });
  it('rechaza si ambos campos están vacíos', () => {
    expect(validarLogin({ correo: '', contrasena: '' })).toBe('Completá todos los campos');
  });
  it('acepta cuando ambos campos están completos', () => {
    expect(validarLogin({ correo: 'a@b.com', contrasena: 'clave123' })).toBeNull();
  });
});

describe('validarRegistro', () => {
  const base = {
    nombre: 'Juan', apellido: 'Perez', correo: 'juan@test.com',
    contrasena: 'clave123', confirmar: 'clave123', aceptado: true,
  };

  it('rechaza si cualquier campo obligatorio está vacío', () => {
    expect(validarRegistro({ ...base, nombre: '' })).toBe('Completá todos los campos');
    expect(validarRegistro({ ...base, apellido: '' })).toBe('Completá todos los campos');
    expect(validarRegistro({ ...base, correo: '' })).toBe('Completá todos los campos');
  });

  it('rechaza si las contraseñas no coinciden', () => {
    expect(validarRegistro({ ...base, confirmar: 'otraClave' }))
      .toBe('Las contraseñas no coinciden');
  });

  it('rechaza si no se aceptaron los términos', () => {
    expect(validarRegistro({ ...base, aceptado: false }))
      .toBe('Debés aceptar los términos y condiciones');
  });

  it('prioriza el error de campos vacíos sobre el de contraseñas', () => {
    expect(validarRegistro({ ...base, nombre: '', confirmar: 'otraClave' }))
      .toBe('Completá todos los campos');
  });

  it('acepta un formulario completo y válido', () => {
    expect(validarRegistro(base)).toBeNull();
  });
});
