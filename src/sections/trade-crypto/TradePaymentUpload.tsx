import { useState, useRef } from "react"
import Upload from "../../assets/icons/upload.svg"
import Cancel from "../../assets/icons/hightlight_off.svg"
import {FileText} from "lucide-react";
import {transactionServiceApi} from "../../api/transaction.api.ts";

interface FileUploadProps {
    onFileUploaded: (value: string) => void
    maxFiles?: number
    acceptedTypes?: string[]
}

export default function TradePaymentUpload({onFileUploaded, maxFiles = 5, acceptedTypes = [".jpg", ".png", ".pdf"] }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([])
    const [isDragOver, setIsDragOver] = useState(false)
    const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({})
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [, setIsUploading] = useState(false)
    const [, setUploadError] = useState<string | null>(null)

    const createFilePreview = (file: File) => {
        const extension = "." + file.name.split(".").pop()?.toLowerCase()
        if (extension === ".jpg" || extension === ".png") {
            return URL.createObjectURL(file)
        }
        return null
    }

    const handleFileUpload = async (file: File) => {
        setIsUploading(true)
        setUploadError(null)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const { url } = await transactionServiceApi.uploadTransactionReceipt(formData);
            onFileUploaded(url || "")
        } catch (error: any) {
            console.error('Upload error:', error)
            setUploadError(
              error.response?.data?.message ||
              error.message ||
              'An error occurred during upload'
            )
        } finally {
            setIsUploading(false)
        }
    }

    const handleFileSelect = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return

        const newFiles = Array.from(selectedFiles).filter((file) => {
            const extension = "." + file.name.split(".").pop()?.toLowerCase()
            return acceptedTypes.includes(extension)
        })

        const updatedFiles = [...files, ...newFiles].slice(0, maxFiles)

        const newPreviews = { ...filePreviews }
        newFiles.forEach((file) => {
            const previewUrl = createFilePreview(file)
            if (previewUrl) {
                newPreviews[file.name] = previewUrl
            }
        })
        const file = newFiles[0];

        setFiles(updatedFiles)
        setFilePreviews(newPreviews)
        handleFileUpload(file)
    }

    const removeFile = (index: number) => {
        const fileToRemove = files[index]
        const updatedFiles = files.filter((_, i) => i !== index)

        if (filePreviews[fileToRemove.name]) {
            URL.revokeObjectURL(filePreviews[fileToRemove.name])
            const updatedPreviews = { ...filePreviews }
            delete updatedPreviews[fileToRemove.name]
            setFilePreviews(updatedPreviews)
        }

        setFiles(updatedFiles)
        onFileUploaded("")
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        // handleFileSelect(e.dataTransfer.files)
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
    }

    const isImageFile = (fileName: string) => {
        const extension = "." + fileName.split(".").pop()?.toLowerCase()
        return extension === ".jpg" || extension === ".png"
    }

    return (
        <div className="space-y-4">
            <div
                className={`border-2 border-dashed rounded-lg py-5 text-center transition-colors cursor-pointer bg-white ${
                    isDragOver ? "border-placeholder " : "border-accent2"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="flex flex-col items-center space-y-4">
                    <img src={Upload || "/placeholder.svg"} alt={`Upload icon`} className={`w-12 h-12`} />

                    <div className="space-y-2">
                        <p className="text-sm">Drag your file(s) to start uploading</p>
                        <div className={`flex items-center justify-between`}>
                            <div className={`w-20 h-0.5 bg-strokeLightGrey`}></div>
                            <p className="text-sm text-textSec">OR</p>
                            <div className={`w-20 h-0.5 bg-strokeLightGrey`}></div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="px-4 py-2 rounded-lg border border-accent2 text-accent2 font-semibold text-sm"
                    >
                        Browse files
                    </button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedTypes.join(",")}
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                />
            </div>

            <p className="text-sm text-gray-500">Only support {acceptedTypes.join(", ")} files</p>

            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between py-3 px-5 bg-white rounded-lg border border-strokeLightGrey"
                        >
                            <div className="flex items-center space-x-3">
                                {isImageFile(file.name) && filePreviews[file.name] ? (
                                    <img
                                        src={filePreviews[file.name] || "/placeholder.svg"}
                                        alt="File preview"
                                        className="w-9 h-9 object-cover rounded"
                                    />
                                ) : (
                                    <FileText className="w-5 h-5 text-textSec" />
                                )}
                                <div>
                                    <p className="text-sm font-semibold">{file.name}</p>
                                    <p className="text-xs text-textSec">{formatFileSize(file.size)}</p>
                                </div>
                            </div>

                            <img
                                src={Cancel || "/placeholder.svg"}
                                alt={`Cancel Icon`}
                                onClick={() => removeFile(index)}
                                className={`cursor-pointer`}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
