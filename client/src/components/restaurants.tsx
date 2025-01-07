import React from "react";
import { Restaurant } from "./restaurant";

interface IRestaurantsProps {
  restaurants?:
    | {
        id: string;
        coverImg: string;
        name: string;
        category?: {
          name: string;
        } | null;
        isPromoted: boolean;
      }[]
    | null
    | undefined;
  totalPages?: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const Restaurants: React.FC<IRestaurantsProps> = ({
  restaurants,
  totalPages,
  page,
  setPage,
}) => {
  const onPrevPageClick = () => setPage((current) => current - 1);
  const onNextPageClick = () => setPage((current) => current + 1);

  return (
    <>
      {restaurants?.length === 0 && (
        <div className="h-60 flex flex-col justify-center items-center">
          <h4 className="text-2xl font-semibold mb-5">Oops! No restaurants match your search</h4>
        </div>
      )}
      <div className="mt-16 responsive-grid">
        {restaurants?.map((restaurant) => (
          <Restaurant
            key={restaurant.id}
            id={restaurant.id + ""}
            coverImg={restaurant.coverImg}
            name={restaurant.name}
            categoryName={restaurant.category?.name}
            isPromoted={restaurant.isPromoted}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 text-center max-w-sm items-center mx-auto my-10">
        <div>
          <button
            hidden={page === 1}
            className="w-12 h-12 font-medium text-2xl focus:outline-none bg-gray-100 hover:bg-gray-200 transition-colors rounded-full p-2"
            onClick={onPrevPageClick}>
            &larr;
          </button>
        </div>
        {restaurants?.length !== 0 && (
          <div className="font-medium text-xl mx-3">
            Page {page} of {totalPages}
          </div>
        )}
        <div>
          <button
            hidden={page === totalPages}
            className="w-12 aspect-square font-medium text-2xl focus:outline-none bg-gray-100 hover:bg-gray-200 transition-colors rounded-full p-2"
            onClick={onNextPageClick}>
            &rarr;
          </button>
        </div>
      </div>
    </>
  );
};
