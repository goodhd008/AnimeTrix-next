
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
interface Relation {
    id: number;
    title : {
        userPreferred : string;
        romaji : string;
        english : string;
        native: string
    };
    relationType: string;
    malId: number;
    status: string;
    episodes: number;
    image: string;
    color: string;
    type: string;
    cover: string;
    rating: number;
}

interface Props {
    id: number;
}
export default async function RelationCard({ id }: Props) {
    const getRelationDetails = async () => {
        try {
            const response = await fetch(`https://animetrix-api.vercel.app/meta/anilist/info/${id}`);
            const data = await response.json();
            return data.relations;
        } catch (error) {
            console.error("Error fetching details:", error);
            return [];
        }
    };
    const details = await getRelationDetails()
    console.log(details)
    return (
        <>
            {Object.keys(details).length > 0 && (
                <section className=' sticky bottom-0 top-0'>
                    <h1 className='text-4xl font-semibold pl-2'>Relation</h1>
                    <div className=" flex gap-4 overflow-x-auto duration-200 mt-9">
                        {details.map((relation : Relation) => (
                            <div className="bg-white/10 p-2 hover:cursor-pointer border-2 hover:scale-95 border-white/40 duration-200 rounded-lg" key={relation.id}>
                                <Link href={`/details/${relation.id}`} className="flex w-80 lg:w-96">
                                    <Image src={relation.image} height={300} width={600} alt={`an image of ${relation.title.userPreferred || relation.title.romaji || relation.title.english || relation.title.native}`} className=' w-28 h-40 bg-cover rounded-lg '></Image>
                                    <div className="flex text-sm p-4 flex-col  gap-3 justify-center font-semibold">
                                        <span>{relation.relationType}</span>
                                        <span className='font-normal'>{relation.title.userPreferred || relation.title.romaji || relation.title.english || relation.title.native}</span>
                                        <span>{relation.type}</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </>
    )

}

