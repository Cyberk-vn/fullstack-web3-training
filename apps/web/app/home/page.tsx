import {
  ConnectWalletButton,
  AppKitButton,
} from "@/components/connect-wallet-button";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Welcome to Web3 Training
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md">
              Connect your wallet to get started with Web3 development
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Main connect wallet button */}
            <ConnectWalletButton
              size="lg"
              showAddress={true}
              className="min-w-[200px]"
            />

            {/* Alternative AppKit button */}
            <AppKitButton
              variant="outline"
              size="lg"
              className="min-w-[160px]"
            />
          </div>

          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Getting Started
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Click "Connect Wallet" to link your Web3 wallet and begin
              exploring decentralized applications and blockchain interactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
