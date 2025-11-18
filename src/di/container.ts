import { AuthRepository } from '../domain/repositories/AuthRepository';
import { IMessageRepository } from '../domain/repositories/IMessageRepository';
import { IStorageRepository } from '../domain/repositories/IStorageRepository';
import { IPlanRepository } from '../domain/repositories/IPlanRepository';

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

// Storage Use Cases (NUEVO)
import { UploadPlanImage } from '../domain/usecases/storage/UploadPlanImage';

// Repositories Impl
import { AuthRepositoryImpl } from '../data/repositories/AuthRepositoryImpl';
import { SupabaseMessageRepository } from '../data/repositories/SupabaseMessageRepository';
import { SupabaseStorageRepository } from '../data/repositories/SupabaseStorageRepository';
import { SupabasePlanRepository } from '../data/repositories/SupabasePlanRepository';

class DIContainer {
    private static instance: DIContainer;

    private _authRepository?: AuthRepository;
    private _storageRepository?: IStorageRepository;
    private _messageRepository?: IMessageRepository;
    private _planRepository?: IPlanRepository;

    // Use Cases Cache
    private _registerUser?: RegisterUser;
    private _loginUser?: LoginUser;
    private _logoutUser?: LogoutUser;
    private _forgotPassword?: ForgotPassword;
    private _updateProfile?: UpdateProfile;
    private _updatePassword?: UpdatePassword;
    private _getCurrentUser?: GetCurrentUser;
    private _sendMensaje?: SendMensaje;
    private _getMessages?: GetMessages;

    // Planes & Storage
    private _updatePlan?: UpdatePlan;
    private _uploadPlanImage?: UploadPlanImage; // <-- Cache

    private constructor() { }

    static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    // --- REPOSITORIOS ---
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

    // --- CASOS DE USO ---
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

    // --- PLANES & STORAGE ---
    get updatePlan(): UpdatePlan {
        if (!this._updatePlan) {
            this._updatePlan = new UpdatePlan(this.planRepository);
        }
        return this._updatePlan!;
    }

    get uploadPlanImage(): UploadPlanImage { // <-- Getter
        if (!this._uploadPlanImage) {
            this._uploadPlanImage = new UploadPlanImage(this.storageRepository);
        }
        return this._uploadPlanImage!;
    }
}

export const container = DIContainer.getInstance();