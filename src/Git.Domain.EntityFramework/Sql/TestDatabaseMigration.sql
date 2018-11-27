select count(*) "Accidents", min(Date) "From", max(Date) "To" from AccidentStatistics
select count(*) "Vehicles" from Vehicles
select count(*) "Casualties" from Casualties
select distinct VehicleType from Vehicles

select * from Vehicles
where Vehicles.VehicleType = 'PedalCycle'

select *  from AccidentStatistics
inner join Casualties on AccidentStatistics.AccidentStatisticId = Casualties.AccidentStatistic_AccidentStatisticId
where AccidentStatistics.Severity = 2
AND Casualties.Mode = 'PedalCycle'
AND Casualties.Severity = 2