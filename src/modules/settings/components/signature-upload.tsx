import { Button, Upload } from 'antd';
import { LuPenTool, LuTrash2, LuUpload } from 'react-icons/lu';

interface ISignatureUploadProps {
  title: string;
  description: string;
  signatureDataUrl: string | null;
  onChange: (dataUrl: string | null) => void;
}

export function SignatureUpload({
  title,
  description,
  signatureDataUrl,
  onChange,
}: ISignatureUploadProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200">
      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          <LuPenTool
            size={20}
            className="text-indigo-500 text-2xl rounded inline align-text-bottom mr-2"
          />
          {title}
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          {description}
          <div className="border-b border-gray-200 mt-2"></div>
        </p>

        {signatureDataUrl ? (
          <div className="flex items-center gap-4">
            <img
              src={signatureDataUrl}
              alt={title}
              className="h-16 rounded-lg border border-gray-200 bg-white"
            />
            <Button danger icon={<LuTrash2 />} onClick={() => onChange(null)}>
              Eliminar firma
            </Button>
          </div>
        ) : (
          <Upload
            accept="image/png,image/jpeg"
            maxCount={1}
            showUploadList={false}
            beforeUpload={(file) => {
              const reader = new FileReader();
              reader.onload = (e) => onChange(e.target?.result as string);
              reader.readAsDataURL(file);
              return false;
            }}
          >
            <Button
              icon={<LuUpload />}
              className="rounded-xl border-gray-200 text-gray-600 font-medium hover:text-indigo-600! hover:border-indigo-500!"
            >
              Cargar imagen de firma
            </Button>
          </Upload>
        )}
      </section>
    </div>
  );
}
