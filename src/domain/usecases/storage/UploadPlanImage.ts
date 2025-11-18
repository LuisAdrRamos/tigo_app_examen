import { IStorageRepository } from "../../repositories/IStorageRepository";

export class UploadPlanImage {
    constructor(private storageRepository: IStorageRepository) { }

    async execute(fileUri: string): Promise<string> {
        if (!fileUri) {
            throw new Error("No se ha proporcionado ninguna imagen.");
        }

        // 1. Generar un nombre único para el archivo
        // Usamos el timestamp para evitar duplicados: plan_171500000.jpg
        const fileName = `plan_${Date.now()}.jpg`;
        const filePath = `planes/${fileName}`; // Carpeta 'planes' dentro del bucket

        // 2. Definir el bucket (debe coincidir con tu SQL: 'planes-imagenes')
        const BUCKET_NAME = 'planes-imagenes';

        // 3. Subir usando el repositorio
        // Asumimos que es un JPG por simplicidad, aunque ImagePicker lo detecta.
        const result = await this.storageRepository.upload(
            BUCKET_NAME,
            filePath,
            fileUri,
            'image/jpeg' 
        );

        // 4. Devolver la URL pública para guardarla en la base de datos
        return result.publicUrl;
    }
}