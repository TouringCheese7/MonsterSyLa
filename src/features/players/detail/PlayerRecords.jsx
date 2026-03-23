export default function PlayerRecords({ records }) {

  return (
    <div className="grid grid-cols-2 gap-4">

      <div className="bg-white/5 p-6 rounded-2xl">
        <p className="text-xs text-gray-500">Donaciones</p>
        <p className="text-3xl text-green-500">
          {records?.max_donaciones_sem || 0}
        </p>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl">
        <p className="text-xs text-gray-500">Guerra</p>
        <p className="text-3xl text-red-500">
          {records?.max_guerra_sem || 0}
        </p>
      </div>

    </div>
  );
}