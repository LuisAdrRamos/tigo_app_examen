import { AuthRepository } from '../domain/repositories/AuthRepository';
import { IMessageRepository } from '../domain/repositories/IMessageRepository';
import { IStorageRepository } from '../domain/repositories/IStorageRepository';
import { IPlanRepository } from '../domain/repositories/IPlanRepository';
import { IContratacionRepository } from '../domain/repositories/IContratacionRepository'; // <-- IMPORTAR INTERFAZ

// Auth Use Cases
import { ForgotPassword } from '../domain/usecases/auth/ForgotPassword';
import { GetCurrentUser } from '../domain/usecases/auth/GetCurrentUser';
import { LoginUser } from '../domain/usecases/auth/LoginUser';
import { LogoutUser } from '../domain/usecases/auth/LogoutUser';
import { RegisterUser } from '../domain/usecases/auth/RegisterUser';
import { UpdatePassword } from '../domain/usecases/auth/UpdatePassword';
import { UpdateProfile } from '../domain/usecases/auth/UpdateProfile';

// Chat Use Cases
import { GetMessages } from '../domain/usecases/chat/GetMessages';
import { SendMensaje } from '../domain/usecases/chat/SendMensaje';

// Planes Use Cases
import { UpdatePlan } from '../domain/usecases/planes/UpdatePlan';

// Storage Use Cases
import { UploadPlanImage } from '../domain/usecases/storage/UploadPlanImage';

// Contratacion Use Cases (IMPORTAR NUEVOS CASOS DE USO)
import { CrearContratacion } from '../domain/usecases/contratacion/CrearContratacion';
import { GestionarSolicitudes } from '../domain/usecases/contratacion/GestionarSolicitudes';

// Repositories Impl
import { AuthRepositoryImpl } from '../data/repositories/AuthRepositoryImpl';
import { SupabaseMessageRepository } from '../data/repositories/SupabaseMessageRepository';
import { SupabaseStorageRepository } from '../data/repositories/SupabaseStorageRepository';
import { SupabasePlanRepository } from '../data/repositories/SupabasePlanRepository';
import { SupabaseContratacionRepository } from '../data/repositories/SupabaseContratacionRepository'; // <-- IMPORTAR IMPLEMENTACIÓN

class DIContainer {
    private static instance: DIContainer;

    // Instancias privadas de Repositorios
    private _authRepository?: AuthRepository;
    private _storageRepository?: IStorageRepository;
    private _messageRepository?: IMessageRepository;
    private _planRepository?: IPlanRepository;
    private _contratacionRepository?: IContratacionRepository; // <-- NUEVO

    // Instancias privadas de Casos de Uso
    private _registerUser?: RegisterUser;
    private _loginUser?: LoginUser;
    private _logoutUser?: LogoutUser;
    private _forgotPassword?: ForgotPassword;
    private _updateProfile?: UpdateProfile;
    private _updatePassword?: UpdatePassword;
    private _getCurrentUser?: GetCurrentUser;
    private _sendMensaje?: SendMensaje;
    private _getMessages?: GetMessages;
    private _updatePlan?: UpdatePlan;
    private _uploadPlanImage?: UploadPlanImage;

    // Cache para Contratación (NUEVOS)
    private _crearContratacion?: CrearContratacion;
    private _gestionarSolicitudes?: GestionarSolicitudes;

    private constructor() { }

    static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    // --- GETTERS DE REPOSITORIOS ---

    get authRepository(): AuthRepository {
        if (!this._authRepository) this._authRepository = new AuthRepositoryImpl();
        return this._authRepository!;
    }

    get storageRepository(): IStorageRepository {
        if (!this._storageRepository) this._storageRepository = new SupabaseStorageRepository();
        return this._storageRepository!;
    }

    get messageRepository(): IMessageRepository {
        if (!this._messageRepository) this._messageRepository = new SupabaseMessageRepository();
        return this._messageRepository!;
    }

    get planRepository(): IPlanRepository {
        if (!this._planRepository) this._planRepository = new SupabasePlanRepository();
        return this._planRepository!;
    }

    // Getter del Repositorio de Contratación
    get contratacionRepository(): IContratacionRepository {
        if (!this._contratacionRepository) {
            this._contratacionRepository = new SupabaseContratacionRepository();
        }
        return this._contratacionRepository!;
    }

    // --- GETTERS DE CASOS DE USO ---

    get registerUser(): RegisterUser {
        if (!this._registerUser) this._registerUser = new RegisterUser(this.authRepository);
        return this._registerUser!;
    }

    get loginUser(): LoginUser {
        if (!this._loginUser) this._loginUser = new LoginUser(this.authRepository);
        return this._loginUser!;
    }

    get logoutUser(): LogoutUser {
        if (!this._logoutUser) this._logoutUser = new LogoutUser(this.authRepository);
        return this._logoutUser!;
    }

    get forgotPassword(): ForgotPassword {
        if (!this._forgotPassword) this._forgotPassword = new ForgotPassword(this.authRepository);
        return this._forgotPassword!;
    }

    get updateProfile(): UpdateProfile {
        if (!this._updateProfile) this._updateProfile = new UpdateProfile(this.authRepository);
        return this._updateProfile!;
    }

    get updatePassword(): UpdatePassword {
        if (!this._updatePassword) this._updatePassword = new UpdatePassword(this.authRepository);
        return this._updatePassword!;
    }

    get getCurrentUser(): GetCurrentUser {
        if (!this._getCurrentUser) this._getCurrentUser = new GetCurrentUser(this.authRepository);
        return this._getCurrentUser!;
    }

    get sendMensaje(): SendMensaje {
        if (!this._sendMensaje) this._sendMensaje = new SendMensaje(this.messageRepository);
        return this._sendMensaje!;
    }

    get getMessages(): GetMessages {
        if (!this._getMessages) this._getMessages = new GetMessages(this.messageRepository);
        return this._getMessages!;
    }

    get updatePlan(): UpdatePlan {
        if (!this._updatePlan) this._updatePlan = new UpdatePlan(this.planRepository);
        return this._updatePlan!;
    }

    get uploadPlanImage(): UploadPlanImage {
        if (!this._uploadPlanImage) this._uploadPlanImage = new UploadPlanImage(this.storageRepository);
        return this._uploadPlanImage!;
    }

    // --- NUEVOS GETTERS DE CONTRATACIÓN ---

    get crearContratacion(): CrearContratacion {
        if (!this._crearContratacion) {
            this._crearContratacion = new CrearContratacion(this.contratacionRepository);
        }
        return this._crearContratacion!;
    }

    get gestionarSolicitudes(): GestionarSolicitudes {
        if (!this._gestionarSolicitudes) {
            this._gestionarSolicitudes = new GestionarSolicitudes(this.contratacionRepository);
        }
        return this._gestionarSolicitudes!;
    }
}

export const container = DIContainer.getInstance();