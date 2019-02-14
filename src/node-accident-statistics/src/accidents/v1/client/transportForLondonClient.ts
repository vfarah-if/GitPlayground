import axios, { AxiosResponse } from "axios";
import { ExtendedArray } from "./../../../arrays/extendedArray";
import {
    AccidentsQuery,
    AccidentStatistic,
    Paging,
    SortByOptions
} from "./../../../models";
import { ascending, compareBy, descending } from "./../../../sort";
import { accidents } from "./../../v2/controllers/accidentStatitics";

// tslint:disable-next-line:interface-name
interface DataByYear {
    year: number;
    data: AccidentStatistic[];
}

export class TransportForLondonClient {
    private cache = new Array<DataByYear>();
    public async getAccidentStatisticsByQuery(query: AccidentsQuery): Promise<Paging<AccidentStatistic>> {
        if (!query) {
            query = new AccidentsQuery();
        }
        this.log("Filtering => ", query);
        return await this.getAccidentStatistics(
            new Date(query.from),
            new Date(query.to),
            query.severity,
            query.sortBy,
            Number(query.page),
            Number(query.pageSize)
        );
    }

    private async getAccidentStatistics(
        from: Date,
        to: Date,
        severity: string,
        sortBy: SortByOptions,
        page: number,
        pageSize: number): Promise<Paging<AccidentStatistic>> {

        const maxYear = Number(process.env.MAX_YEAR);

        if (from && from.getFullYear() < 2005) {
            this.raiseDataBelow2005();
        }

        if (from && from.getFullYear() > maxYear) {
            this.raiseMaxYearNotSupported(maxYear);
        }

        if (to && to.getFullYear() > maxYear) {
            this.raiseMaxYearNotSupported(maxYear);
        }

        if (from > to) {
            const temp = from;
            from = to;
            to = temp;
        }

        const allAccidentStatistics = new ExtendedArray<AccidentStatistic>();
        for (let year = from.getFullYear(); year <= to.getFullYear(); year++) {
            let dataByYear = this.cache.find((item) => item.year === year);
            if (!dataByYear) {
                const response = await this.getAccidentStatisticsByYear(year);
                const cacheItem = { year, data: response.data };
                this.cache.push(cacheItem);
                dataByYear = cacheItem;
            } else {
                this.log(`Retrieved data from cache for year ${year}`);
            }
            if (dataByYear) {
                dataByYear.data.forEach((item) => {
                    allAccidentStatistics.push(item);
                });
            }
        }

        const fromAsISOString = from.toISOString();
        const toAsISOString = to.toISOString();
        this.log(`Data length before filtering =>`, allAccidentStatistics.length);
        const filteredAccidentStatistics = allAccidentStatistics.query((item) =>
                item.severity && item.severity.toLowerCase() === severity.toLowerCase() &&
                item.date && item.date >= fromAsISOString && item.date <= toAsISOString);
        this.log(`Data length after filtering =>`, filteredAccidentStatistics.length);
        this.sortFilteredData(filteredAccidentStatistics, sortBy);
        let result = new Paging<AccidentStatistic>();
        result = result.generate(filteredAccidentStatistics, page, pageSize);
        return Promise.resolve<Paging<AccidentStatistic>>(result);
    }

    private raiseDataBelow2005() {
        throw new Error("No data below 2005");
    }

    private raiseMaxYearNotSupported(maxYear: number) {
        throw new Error(`No data greater than '${maxYear}'`);
    }

    private async getAccidentStatisticsByYear(year: number): Promise<AxiosResponse<AccidentStatistic[]>> {
        const headers = {
            headers: {
                "Content-Type": "application/json",
                // tslint:disable-next-line:object-literal-sort-keys
                "Accept": "application/json"
            }
        };
        const url = `${process.env.TFL_ACCIDENTS_URL}/${year}`;
        this.log(`Retrieving data from live url '${process.env.TFL_ACCIDENTS_URL}/${year}'`);
        return axios.get(url, { headers });
    }

    private sortFilteredData(data: ExtendedArray<AccidentStatistic>, sortBy: SortByOptions): void {
        this.log("Sorting data by ...");
        switch (sortBy.toLowerCase()) {
            case "dateascending":
                this.log("    Sorting Date Ascending");
                data.ascending((orderBy: AccidentStatistic) => orderBy.date);
                break;
            case "locationascending":
                this.log("Location Ascending");
                data.ascending((orderBy: AccidentStatistic) => orderBy.location);
                break;
            case "boroughascending":
                this.log("    Borough Ascending");
                data.ascending((orderBy: AccidentStatistic) => orderBy.borough);
                break;
            case "locationdescending":
                this.log("    Location Descending");
                data.descending((orderBy: AccidentStatistic) => orderBy.location);
                break;
            case "boroughdescending":
                this.log("    Borough Descending");
                data.descending((orderBy: AccidentStatistic) => orderBy.borough);
                break;
            case "datedescending":
            default:
                this.log("    Date Descending (Default)");
                data.descending((orderBy: AccidentStatistic) => orderBy.date);
        }
    }

    private log(message: string, ...argument: any): void {
        if (argument && argument.length > 0) {
            // tslint:disable-next-line:no-console
            console.log(message, argument);
        } else {
            // tslint:disable-next-line:no-console
            console.log(message);
        }
    }
}
