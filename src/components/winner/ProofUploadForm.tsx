'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, AlertCircle, FileImage, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ProofUploadFormProps {
  verificationId: string;
  drawDate: string;
  prizeAmount: number;
  onSuccess?: () => void;
}

export const ProofUploadForm = ({ verificationId, drawDate, prizeAmount, onSuccess }: ProofUploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formatPence = (pence: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(pence / 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/winner/${verificationId}/upload-proof`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        setSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload proof");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xl font-black text-white uppercase tracking-tighter">Proof Submitted!</h4>
          <p className="text-zinc-500 text-sm font-medium">An admin will review your proof and finalize your payout reference soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 pointer-events-none transition-transform group-hover:scale-110">
        <FileImage className="w-32 h-32 text-emerald-500" />
      </div>

      <div className="space-y-1">
        <p className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">{drawDate} Draw</p>
        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Upload Proof for {formatPence(prizeAmount)}</h3>
        <p className="text-zinc-500 text-sm font-medium max-w-sm">Please upload a screenshot of your official golf scorecard verifying your winning numbers.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative">
        {!preview ? (
          <label className="relative block h-48 border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-[2rem] transition-all cursor-pointer group/upload">
            <input 
              type="file" 
              className="hidden" 
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              required
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-zinc-600 group-hover/upload:text-emerald-500">
              <Upload className="w-10 h-10" />
              <div className="text-center">
                <span className="block font-black text-sm uppercase tracking-widest">Click to Upload</span>
                <span className="text-xs font-medium text-zinc-600">JPG, PNG or WEBP (Max 5MB)</span>
              </div>
            </div>
          </label>
        ) : (
          <div className="relative group/preview">
            <div className="relative h-64 w-full rounded-[2rem] overflow-hidden border border-zinc-700 bg-zinc-950">
              <Image 
                src={preview} 
                alt="Proof Preview" 
                fill 
                className="object-contain"
              />
            </div>
            <button
              onClick={() => {setFile(null); setPreview(null);}}
              className="absolute top-4 right-4 p-2 bg-zinc-900/80 text-white rounded-full hover:bg-zinc-800 transition-all border border-zinc-700 backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold tracking-tight">{error}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={!file || loading}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Uploading Proof...</span>
            </>
          ) : (
            'Submit Proof for Review'
          )}
        </button>
      </form>
    </div>
  );
};
