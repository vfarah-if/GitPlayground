import axios, { AxiosResponse } from "axios";
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

        const allAccidentStatistics = Array<AccidentStatistic>();

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
        const filteredAccidentStatistics = allAccidentStatistics
            .filter((item) => item.severity && item.severity === severity &&
                item.date && item.date >= fromAsISOString && item.date <= toAsISOString);
        this.log(`Data length after filtering =>`, filteredAccidentStatistics.length);
        this.sortFilteredData(filteredAccidentStatistics, sortBy);
        const result = new Paging<AccidentStatistic>();
        result.data = filteredAccidentStatistics;
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

    private sortFilteredData(data: AccidentStatistic[], sortBy: SortByOptions): void {
        this.log("Sorting data by ...");
        switch (sortBy.toLowerCase()) {
            case "dateascending":
                this.log("    Sorting Date Ascending");
                data.sort((a: AccidentStatistic, b: AccidentStatistic) =>
                    compareBy((orderBy: AccidentStatistic) => orderBy.date, ascending, a, b));
                break;
            case "locationascending":
                this.log("Location Ascending");
                data.sort((a: AccidentStatistic, b: AccidentStatistic) =>
                    compareBy((orderBy: AccidentStatistic) => orderBy.location, ascending, a, b));
                break;
            case "boroughascending":
                this.log("    Borough Ascending");
                data.sort((a: AccidentStatistic, b: AccidentStatistic) =>
                    compareBy((orderBy: AccidentStatistic) => orderBy.borough, ascending, a, b));
                break;
            case "locationdescending":
                this.log("    Location Descending");
                data.sort((a: AccidentStatistic, b: AccidentStatistic) =>
                    compareBy((orderBy: AccidentStatistic) => orderBy.location, descending, a, b));
                break;
            case "boroughdescending":
                this.log("    Borough Descending");
                data.sort((a: AccidentStatistic, b: AccidentStatistic) =>
                    compareBy((orderBy: AccidentStatistic) => orderBy.borough, descending, a, b));
                break;
            case "datedescending":
            default:
                this.log("    Date Descending (Default)");
                data.sort((a: AccidentStatistic, b: AccidentStatistic) =>
                    compareBy((orderBy: AccidentStatistic) => orderBy.date, descending, a, b));
                break;
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
