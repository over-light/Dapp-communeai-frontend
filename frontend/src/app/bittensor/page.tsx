"use client";
import BittensorItem from "@/components/molecules/bittensor/item";
import { items } from "@/components/molecules/bittensor/item-date";

export default function () {
    


	return (
		<main className="mt-[30px] my-auto mx-auto xl:w-[1400px] px-[20px] py-[50px]">
            <h2 className="text-[32px] font-bold text-left">
                Bittensor Subnets
            </h2>
            <div className="mt-[60px] flex flex-wrap justify-start gap-x-[20px] gap-y-[40px]">
                {
                    items.map((item, idx) => (
                        <BittensorItem {...item} />
                    ))   
                }
            </div>
        </main>
    )
}