import { AuthRepository } from '../domain/repositories/AuthRepository';
import { IStorageRepository } from '../domain/repositories/IStorageRepository';
import { IMessageRepository } from '../domain/repositories/IMessageRepository';

// --- CASOS DE USO DE AUTH ---
import { RegisterUser } from '../domain/usecases/auth/RegisterUser';
import { LoginUser } from '../domain/usecases/auth/LoginUser';
import { LogoutUser } from '../domain/usecases/auth/LogoutUser';
import { ForgotPassword } from '../domain/usecases/auth/ForgotPassword';
import { UpdateProfile } from '../domain/usecases/auth/UpdateProfile';
import { UpdatePassword } from '../domain/usecases/auth/UpdatePassword';
import { GetCurrentUser } from '../domain/usecases/auth/GetCurrentUser';

// --- OTROS CASOS DE USO (Resumidos para brevedad, añade los que falten) ---
import { SendMensaje } from '../domain/usecases/chat/SendMensaje';
import { GetMessages } from '../domain/usecases/chat/GetMessages';

// --- IMPLEMENTACIONES DE DATA ---
import { AuthRepositoryImpl } from '../data/repositories/AuthRepositoryImpl';
import { SupabaseStorageRepository } from '../data/repositories/SupabaseStorageRepository';
import { SupabaseMessageRepository } from '../data/repositories/SupabaseMessageRepository';
// Añade los otros repositorios si los usas (Routine, Training, Progress)

class DIContainer {
    private static instance: DIContainer;

    // Instancias privadas (pueden ser undefined al inicio)
    private _authRepository?: AuthRepository;
    private _storageRepository?: IStorageRepository;
    private _messageRepository?: IMessageRepository;
    // ... otros repositorios

    // Casos de uso
    private _registerUser?: RegisterUser;
    private _loginUser?: LoginUser;
    private _logoutUser?: LogoutUser;
    private _forgotPassword?: ForgotPassword;
    private _updateProfile?: UpdateProfile;
    private _updatePassword?: UpdatePassword;
    private _getCurrentUser?: GetCurrentUser;

    private _sendMensaje?: SendMensaje;
    private _getMessages?: GetMessages;

    private constructor() { }

    static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    // ====================================================
    // 1. GETTERS DE REPOSITORIOS (Data Layer)
    // ====================================================

    get authRepository(): AuthRepository {
        if (!this._authRepository) {
            this._authRepository = new AuthRepositoryImpl();
        }
        // El '!' le dice a TS: "Confía en mí, esto no es null aquí"
        return this._authRepository!;
    }

    get storageRepository(): IStorageRepository {
        if (!this._storageRepository) {
            this._storageRepository = new SupabaseStorageRepository();
        }
        return this._storageRepository!;
    }

    get messageRepository(): IMessageRepository {
        if (!this._messageRepository) {
            this._messageRepository = new SupabaseMessageRepository();
        }
        return this._messageRepository!;
    }

    // ====================================================
    // 2. GETTERS DE CASOS DE USO (Domain Layer)
    // ====================================================

    get registerUser(): RegisterUser {
        if (!this._registerUser) {
            this._registerUser = new RegisterUser(this.authRepository);
        }
        return this._registerUser!;
    }

    get loginUser(): LoginUser {
        if (!this._loginUser) {
            this._loginUser = new LoginUser(this.authRepository);
        }
        return this._loginUser!;
    }

    get logoutUser(): LogoutUser {
        if (!this._logoutUser) {
            this._logoutUser = new LogoutUser(this.authRepository);
        }
        return this._logoutUser!;
    }

    get forgotPassword(): ForgotPassword {
        if (!this._forgotPassword) {
            this._forgotPassword = new ForgotPassword(this.authRepository);
        }
        return this._forgotPassword!;
    }

    get updateProfile(): UpdateProfile {
        if (!this._updateProfile) {
            this._updateProfile = new UpdateProfile(this.authRepository);
        }
        return this._updateProfile!;
    }

    get updatePassword(): UpdatePassword {
        if (!this._updatePassword) {
            this._updatePassword = new UpdatePassword(this.authRepository);
        }
        return this._updatePassword!;
    }

    get getCurrentUser(): GetCurrentUser {
        if (!this._getCurrentUser) {
            this._getCurrentUser = new GetCurrentUser(this.authRepository);
        }
        return this._getCurrentUser!;
    }

    // --- CHAT ---
    get sendMensaje(): SendMensaje {
        if (!this._sendMensaje) {
            this._sendMensaje = new SendMensaje(this.messageRepository);
        }
        return this._sendMensaje!;
    }

    get getMessages(): GetMessages {
        if (!this._getMessages) {
            this._getMessages = new GetMessages(this.messageRepository);
        }
        return this._getMessages!;
    }
}

export const container = DIContainer.getInstance();