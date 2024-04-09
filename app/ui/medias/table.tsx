import {
  DocumentTextIcon,
  SpeakerWaveIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';

export default function MediasTable({ medias }: { medias: Array<Media> }) {
  const renderType = (type: string) => {
    switch (type) {
      case 'video':
        return <VideoCameraIcon className="h-5" />;
      case 'audio':
        return <SpeakerWaveIcon className="h-5" />;
      case 'text':
        return <DocumentTextIcon className="h-5" />;
      default:
        return <p>{type}</p>;
    }
  };
  const renderContent = (media: Media) => {
    switch (media.type) {
      case 'video':
        return (
          <div className="flex items-center justify-center">
            <video controls className="mt-2 max-h-full max-w-full">
              <source src={media.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'audio':
        return (
          <div className="flex items-center justify-center">
            <audio controls>
              <source src={media.url} type="audio/mp3" />
            </audio>
          </div>
        );
      case 'text':
        return <div className=" flex">{media.text}</div>;
      default:
        return (
          <div className="flex items-center justify-center text-center">
            Other not supported media
          </div>
        );
    }
  };
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {medias?.map((media) => (
              <div
                key={media?.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <p className="text-sm text-gray-500">{media?.title}</p>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th
                  scope="col"
                  className=" px-4 py-5 text-center font-medium sm:pl-6"
                >
                  Id
                </th>
                <th
                  scope="col"
                  className=" px-4 py-5 text-center font-medium sm:pl-6"
                >
                  Títol
                </th>
                <th scope="col" className=" px-3 py-5 text-center font-medium">
                  Tipus
                </th>
                <th scope="col" className=" px-3 py-5 text-center font-medium">
                  Contingut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {medias?.map((media) => (
                <tr
                  key={media?.id}
                  className="border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className=" px-3 py-3 text-center">{media?.id}</td>
                  <td className=" px-3 py-3 text-center">{media?.title}</td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center">
                      {renderType(media?.type)}
                    </div>
                  </td>
                  <td className="h-36 w-96 overflow-hidden">
                    <div className="flex h-full w-full justify-center overflow-y-auto">
                      {renderContent(media)}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
