import React, { Suspense } from "react";
import { Play, Star } from "lucide-react";
import Link from "next/link";

import AddToBookmark from "@/components/buttons/AddToBookmark";
import ServerError from "@/components/error/ServerError";
import CharactersLoading from "@/components/loading/CharactersLoading";
import EpisodeLoading from "@/components/loading/EpisodeLoading";
import RecommendedLoading from "@/components/loading/RecommendedLoading";
import RelationLoading from "@/components/loading/RelationLoading";
import NextAiringEpisode from "@/components/NextAiringEpisode";
import CharacterCard from "@/components/shared/cards/characterCard";
import EpisodeLists from "@/components/shared/cards/EpisodeLists";
import RelationCard from "@/components/shared/cards/RelationCard";
import { RecommendedAnime } from "@/components/shared/RecommendedAnime";
import { getAnimeDetails } from "@/lib/AnimeFetch";

export default async function page({ params }: { params: { animeId: number } }) {
    const details = await getAnimeDetails(params.animeId);
    if (Object.keys(details)?.length <= 0 || !details.title) {
        return <ServerError />;
    }
    /**
     * Returns the abbreviated month name for a given month number.
     * @param month - The month number (0-11).
     * @returns The abbreviated month name.
     */
    const getAbbreviatedMonth = (month: number): string => {
        const abbreviatedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return abbreviatedMonths[month];
    };

    // Get the next airing date for the anime.
    const airingDate = new Date(details.nextAiringEpisode?.airingTime * 1000);

    // Extract the day, month, and year from the airing date.
    const day = airingDate.getDate();
    const month = getAbbreviatedMonth(airingDate.getMonth());
    const year = airingDate.getFullYear();
    const currentYear = new Date().getFullYear();

    // Format the time string using the 12-hour clock format.
    const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };
    const timeString = airingDate.toLocaleString(undefined, options);

    // Format the airing date string based on the year.
    let formattedAiringDate;
    if (year === currentYear) {
        formattedAiringDate = `${day} ${month} at ${timeString}`;
    } else {
        formattedAiringDate = `${day} ${month} ${year} at ${timeString}`;
    }

    const title = details?.title?.romaji || details?.title?.english || details?.title?.native || "Unknown";
    const modifiedTitle = title.replace(/-/g, " ");
    return (
        <section className="flex flex-col p-4 mt-4 overflow-hidden">
            <div className="flex md:flex-row flex-col gap-4 items-center flex-wrap">
                <img height={200} width={400} src={details.coverImage} className=" w-48 lg:w-72 rounded-lg" alt={`an image of ${modifiedTitle}`} />
                <div className="flex flex-col gap-5 items-center md:items-start">
                    <h1 className="md:text-4xl lg:text-4xl text-2xl font-bold text-center md:text-left">{modifiedTitle}</h1>
                    {details.totalEpisodes !== null && <span className="font-semibold text-sm md:text-xl">Episodes : {details.totalEpisodes}</span>}
                    <div className="flex flex-wrap gap-5 font-semibold">
                        <span>{details?.year}</span>
                        <span>{details?.type}</span>
                        <span>{details?.status}</span>
                        <span className="flex items-center gap-3">
                            {details.averageRating && `${details.averageRating}`}
                            <Star size={17} fill="white" />
                        </span>
                    </div>
                    <div className="flex gap-5 flex-wrap justify-center lg:text-xl">
                        <Link href={"#episodes"} className="bg-white  p-4 gap-3 rounded-lg  text-black font-semibold flex items-center duration-200 hover:scale-95">
                            <Play />
                            Watch Now
                        </Link>
                        <AddToBookmark animeId={params.animeId} image={details.image || "https://s4.anilist.co/file/anilistcdn/character/large/default.jpg"} title={modifiedTitle} />
                    </div>
                    {details?.description && (
                        <div
                            className="max-w-4xl bg-white/10  border-2 border-white/30
                rounded-lg font-semibold p-2 lg:text-xl lg:max-h-48 max-h-40  overflow-scroll hiddenscroll"
                        >
                            <p dangerouslySetInnerHTML={{ __html: details?.description }}></p>
                        </div>
                    )}
                </div>
            </div>

            <div className=" mt-8 flex flex-col gap-5 ">
                {details.nextAiringEpisode !== undefined && (
                    <div className="md:w-1/2">
                        <NextAiringEpisode nextAiringEpisode={details?.nextAiringEpisode?.episode} formattedAiringDate={formattedAiringDate} />
                    </div>
                )}
                <Suspense fallback={<EpisodeLoading />}>
                    <EpisodeLists animeId={params.animeId} />
                </Suspense>
            </div>

            <div className="mt-7 flex flex-col gap-5">
                <Suspense fallback={<RelationLoading />}>
                    <RelationCard id={params.animeId} bannerImage={details.coverImage} />
                </Suspense>
            </div>
            <div className="mt-7 flex flex-col gap-5">
                <Suspense fallback={<CharactersLoading />}>
                    <CharacterCard characters={details.characters} />
                </Suspense>
            </div>
            <div className="mt-7 flex flex-col gap-5">
                <Suspense fallback={<RecommendedLoading />}>
                    <RecommendedAnime episode={params.animeId} />
                </Suspense>
            </div>
        </section>
    );
}
