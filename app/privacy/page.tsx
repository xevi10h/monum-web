import { Metadata } from 'next';
import MonumLetters from '@/app/ui/monum-letters';
import MonumIcon from '@/app/ui/monum-icon-white';

export const metadata: Metadata = {
  title: 'Privacy',
};

export default function Page() {
  return (
    <div className="p-42 relative mx-auto mb-20 flex flex-col space-y-2.5">
      <div
        className="h-30 align-items-center flex shrink-0 justify-end gap-3 rounded-lg bg-monum-green-dark px-20 py-10"
        style={{
          backgroundImage: 'url(/background_monums_horizontal.png)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          width: '100%',
          minHeight: '150px',
        }}
      >
        <MonumIcon />
        <MonumLetters />
      </div>
      <div className="rounded-lg bg-white p-4 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-monum-green-default">
          Política de Privacidad de Monum
        </h1>
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-monum-green-default">
            Introducción
          </h2>
          <p>
            En Monum, nos comprometemos a proteger su privacidad. Esta Política
            de Privacidad explica cómo recopilamos, usamos, procesamos, y
            compartimos su información personal al usar Monum.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-monum-green-default">
            Consentimiento de los Usuarios
          </h2>
          <p>
            Al registrarse o hacer login en nuestra aplicación, usted acepta
            nuestras políticas de privacidad. Puede retirar este consentimiento
            en cualquier momento notificándonos a través de nuestros canales de
            contacto.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-monum-green-default">
            Menores de Edad
          </h2>
          <p>
            Nuestra aplicación permite el registro de usuarios menores de edad.
            Obtener el consentimiento de los padres o tutores legales para tales
            usuarios es una responsabilidad que estamos explorando cómo
            gestionar de manera efectiva.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-monum-green-default">
            Transferencias Internacionales de Datos
          </h2>
          <p>
            Actualmente, no transferimos datos de usuarios fuera de la Unión
            Europea ni a organizaciones internacionales.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-monum-green-default">
            Proveedores de Terceros y Socios
          </h2>
          <p>
            En el futuro, podemos compartir datos con plataformas de publicidad.
            Nos comprometemos a asegurar que estos terceros ofrezcan garantías
            adecuadas para proteger su privacidad.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-monum-green-default">
            Derechos Específicos de los Usuarios
          </h2>
          <p>
            Bajo el GDPR y otras regulaciones de privacidad, usted tiene
            derechos sobre sus datos, incluidos el acceso, la rectificación, la
            eliminación, la oposición al procesamiento, la limitación del
            procesamiento, y la portabilidad de los datos. Puede ejercer estos
            derechos contactándonos directamente.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-monum-green-default">
            Seguridad de los Datos
          </h2>
          <p>
            La seguridad de sus datos es de suma importancia para nosotros.
            Realizamos pruebas de seguridad de manera recurrente para asegurar
            la protección y la integridad de su información personal. Además,
            aplicamos medidas de seguridad técnicas como la encriptación de
            contraseñas y datos sensibles. Todas las comunicaciones dentro de
            nuestra aplicación utilizan el protocolo HTTPS para encriptar los
            datos transmitidos, cumpliendo con los estándares actuales de
            ciberseguridad y garantizando la seguridad de su información.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-monum-green-default">
            Notificación de Violaciones de Datos
          </h2>
          <p>
            En caso de una violación de seguridad que afecte sus datos
            personales, hemos establecido un protocolo para informarle de manera
            transparente y eficaz. Este protocolo incluye el envío de un correo
            electrónico a todos los usuarios registrados, detallando la
            naturaleza de la violación, los datos posiblemente afectados, las
            acciones que hemos tomado para remediar la situación y las medidas
            que usted puede tomar para proteger sus datos. Estamos comprometidos
            con la transparencia y la protección de nuestros usuarios, actuando
            con rapidez y responsabilidad ante cualquier incidente de seguridad.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-monum-green-default">
            Cambios a Esta Política de Privacidad
          </h2>
          <p>
            Podemos modificar esta política de privacidad en cualquier momento.
            Cualquier cambio se comunicará adecuadamente a los usuarios
          </p>
        </section>
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-monum-green-default">
            Contacto
          </h2>
          <p>
            Para cualquier pregunta relacionada con esta política o sus datos
            personales, por favor contáctenos en:
          </p>
          <p>
            <b>Correo Electrónico:</b>{' '}
            <a href="mailto:monum.mobile.app@gmail.com">
              monum.mobile.app@gmail.com
            </a>
          </p>
          <p>
            <b>Teléfono móvil:</b> +34 606 40 42 51
          </p>
        </section>
      </div>
    </div>
  );
}
