"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Sparkles } from "lucide-react"

interface UploadPanelProps {
  resumeFile: File | null
  jobDescription: string
  isLoading: boolean
  onFileUpload: (file: File) => void
  onJobDescriptionChange: (value: string) => void
  onJobDescriptionSubmit: () => void
  onStartInterview: () => void
}

export function UploadPanel({
  resumeFile,
  jobDescription,
  isLoading,
  onFileUpload,
  onJobDescriptionChange,
  onJobDescriptionSubmit,
  onStartInterview,
}: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  return (
    <Card className="mb-6 bg-white/5 border border-white/10 backdrop-blur-xl">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold text-sm text-emerald-400 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Setup Interview Session
        </h3>

        <div>
          <label className="block text-xs font-medium mb-2 text-gray-300">Resume (PDF)</label>
          <div
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className={`border-2 border-dashed ${
              isLoading
                ? "border-gray-500 cursor-not-allowed"
                : "border-white/20 cursor-pointer hover:border-emerald-400/50"
            } rounded-lg p-4 text-center transition-colors group`}
          >
            {resumeFile ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <FileText className="w-4 h-4" />
                <span className="text-xs">{resumeFile.name}</span>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mb-2"></div>
                <p className="text-xs text-gray-400">Processing...</p>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                <p className="text-xs text-gray-400 group-hover:text-gray-300">Click to upload resume</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-2 text-gray-300">Job Description</label>
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            disabled={isLoading}
            className={`min-h-[80px] bg-white/5 border-white/20 text-white placeholder:text-gray-500 text-xs resize-none ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
          <Button
            onClick={onJobDescriptionSubmit}
            disabled={!jobDescription.trim() || isLoading}
            size="sm"
            variant="outline"
            className="mt-2 text-xs border-white/20 hover:bg-white/10"
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              <>Submit Job Description</>
            )}
          </Button>
        </div>

        {resumeFile && jobDescription && (
          <Button
            onClick={onStartInterview}
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-xs ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Start Interview Prep
            <Sparkles className="w-3 h-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
