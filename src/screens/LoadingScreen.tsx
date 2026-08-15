import Loader from '../components/Loader';

export default function LoadingScreen() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <Loader label="Finding something for you..." />
    </div>
  );
}
