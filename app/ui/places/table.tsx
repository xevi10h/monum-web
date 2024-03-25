import { UpdatePlace, DeletePlace } from '@/app/ui/places/buttons';

export default function PlacesTable({ places }: { places: Array<Place> }) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {places?.map((place) => (
              <div
                key={place?.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <p className="text-sm text-gray-500">{place?.name}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdatePlace id={place?.id} />
                    <DeletePlace id={place?.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden table-fixed text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Id
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nom
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Adreça
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Importància
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {places?.map((place) => (
                <tr
                  key={place?.id}
                  className="border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className=" px-3 py-3">{place?.id}</td>
                  <td className=" px-3 py-3">{place?.name}</td>
                  <td className=" px-3 py-3">
                    {`${
                      place?.address.street.includes('undefined')
                        ? 'NO STREET'
                        : place?.address.street
                    }
                    ,
                    ${place?.address.city.includes('undefined') ? 'NO CITY' : place?.address.city}
                    ,
                    ${place?.address.postalCode.includes('undefined') ? 'NO POSTAL CODE' : place?.address.postalCode}
                    ,
                    ${place?.address.province.includes('undefined') ? 'NO PROVINCE' : place?.address.province}
                    ,
                    ${place?.address.country.includes('undefined') ? 'NO COUNTRY' : place?.address.country}`}
                  </td>
                  <td className="px-3	 py-3 text-center">{place?.importance}</td>

                  <td className="py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePlace id={place?.id} />
                      <DeletePlace id={place?.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
