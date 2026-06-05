import { Smartphone, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useProfile } from "@/features/profiles/hooks/ProfileLogic";

export default function SecurityTab() {
    const { values, functions} = useProfile();
    const [newPassword, setNewPassword] = useState("");
    const [totpCode, setTotpCode] = useState("");
    const [lastChanged, setLastChanged] = useState<string | null>(null);
    const [showQrModal, setShowQrModal] = useState(false);
    const PASSWORD_KEY = "pwd_last_changed";

    useEffect(() => {
        setLastChanged(localStorage.getItem(PASSWORD_KEY));
    }, []);

    const cooldownMs = 24 * 60 * 60 * 1000;
    const canChangePassword = !lastChanged || Date.now() - Number(lastChanged) > cooldownMs;
    const hoursLeft = lastChanged
    ? Math.ceil((cooldownMs - (Date.now() - Number(lastChanged))) / (1000 * 60 * 60))
    : 0;


    const handlePasswordChange = async () => {
        functions.handleUpdatePassword(newPassword);
        localStorage.setItem(PASSWORD_KEY, Date.now().toString());
        setLastChanged(Date.now().toString());
        setNewPassword("");
    };

    return (
        <>
            {/* Password */}
            <div>
                <h3 className="text-white mb-1 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                    Password
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                    {lastChanged
                        ? `Last changed ${new Date(Number(lastChanged)).toLocaleDateString()}`
                        : "No recent changes"}
                </p>

                {!canChangePassword ? (
                    <p className="text-yellow-400 text-sm">
                        You can change your password again in {hoursLeft} hour{hoursLeft !== 1 ? "s" : ""}.
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-[#2D2D2D] text-white text-sm px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-white/20"
                            />
                            <button
                                onClick={handlePasswordChange}
                                disabled={values.isLoading || !newPassword}
                                className="bg-[#3D3D3D] hover:bg-[#4D4D4D] disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                            >
                                {values.isLoading ? "Saving..." : "Change password"}
                            </button>
                        </div>
                        {values.success && <p className="text-green-400 text-sm">✓ Password changed successfully</p>}
                    </div>
                )}
            </div>

            {/* Two-Factor Authentication */}
            <div>
                <h3 className="text-white mb-1 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-400" />
                    Two-factor authentication
                </h3>
                <p className="text-gray-400 text-sm mb-3">Add an extra layer of security to your account.</p>

                {/* Step 1 — not yet enrolled */}
                {!values.qrCodeUrl && !values.factorId && (
                    <div className="flex items-center gap-3">
                        {values.mfaEnabled ? (
                            <>
                                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Enabled</span>
                                <button
                                    onClick={functions. handleDisable2FA}
                                    disabled={values.isLoading}
                                    className="bg-red-600/20 hover:bg-red-600/30 disabled:opacity-50 text-red-400 px-4 py-2 rounded-lg transition-colors text-sm"
                                >
                                    {values.isLoading ? "Disabling..." : "Disable 2FA"}
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">Not enabled</span>
                                <button
                                    onClick={functions.handleEnroll2FA}
                                    disabled={values.isLoading}
                                    className="bg-[#3D3D3D] hover:bg-[#4D4D4D] disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                                >
                                    {values.isLoading ? "Loading..." : "Enable 2FA"}
                                </button>
                            </>
                        )}
                    </div>
                )}
    
                {values.qrCodeUrl && values.factorId && (
                    <div className="flex flex-col gap-3">
                        <p className="text-gray-400 text-sm">Scan this QR code with your authenticator app, then enter the 6-digit code below.</p>
                        
                        <button
                        onClick={() => setShowQrModal(true)}
                        className="relative w-40 h-40 rounded-lg overflow-hidden group"
                        >
                        <img src={values.qrCodeUrl} alt="2FA QR Code" className="w-full h-full" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs">Click to enlarge</span>
                        </div>
                        </button>

                        <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="6-digit code"
                            maxLength={6}
                            value={totpCode}
                            onChange={(e) => setTotpCode(e.target.value)}
                            className="bg-[#2D2D2D] text-white text-sm px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-white/20 w-32"
                        />
                        <button
                            onClick={() => functions.handleVerify2FA(totpCode)}
                            disabled={values.isLoading || totpCode.length !== 6}
                            className="bg-[#3D3D3D] hover:bg-[#4D4D4D] disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                            {values.isLoading ? "Verifying..." : "Confirm"}
                        </button>
                        </div>
                    </div>
                )}

                {showQrModal && values.qrCodeUrl && (
                    <div
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200]"
                        onClick={() => setShowQrModal(false)}
                    >
                        <div
                        className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4"
                        onClick={(e) => e.stopPropagation()}
                        >
                        <h3 className="text-gray-800 font-semibold">Scan with your authenticator app</h3>
                        <img src={values.qrCodeUrl} alt="2FA QR Code" className="w-72 h-72" />
                        <p className="text-gray-500 text-xs text-center max-w-xs">
                            Use Google Authenticator, Authy, or any TOTP app to scan this code.
                        </p>
                        <button
                            onClick={() => setShowQrModal(false)}
                            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm"
                        >
                            Done
                        </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}