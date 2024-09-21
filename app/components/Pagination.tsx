import { useSearchParams, useNavigate } from "@remix-run/react";
import { Button } from "./ui/button";
import { formUrlQuery } from "../libs/utils";

export default function Pagination({ page, totalPages }: PaginationProps) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()

    const handleNavigation = (type: "prev" | "next") => {
        const pageNumber = type === "prev" ? page - 1 : page + 1;

        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "page",
            value: pageNumber.toString(),
        });

        navigate(newUrl, { preventScrollReset: false });
    };

    return (
        <div className="flex justify-between gap-3">
            <Button
                size="lg"
                variant="ghost"
                className="p-0 hover:bg-transparent"
                onClick={() => handleNavigation("prev")}
                disabled={Number(page) <= 1}
            >
                <img
                    src="/icons/arrow-left.svg"
                    alt="arrow"
                    width={20}
                    height={20}
                    className="mr-2"
                />
                Prev
            </Button>
            <p className="text-14 flex items-center px-2">
                {page} / {totalPages}
            </p>
            <Button
                size="lg"
                variant="ghost"
                className="p-0 hover:bg-transparent"
                onClick={() => handleNavigation("next")}
                disabled={Number(page) >= totalPages}
            >
                Next
                <img
                    src="/icons/arrow-left.svg"
                    alt="arrow"
                    width={20}
                    height={20}
                    className="ml-2 -scale-x-100"
                />
            </Button>
        </div>
    );
}
