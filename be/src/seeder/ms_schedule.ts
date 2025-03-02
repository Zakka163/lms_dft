import MsSchedule from "../modul/ms_schedule/model.js";

type Schedule = {
    hari: string;
    jam_awal: string;
    jam_akhir: string;
    status: boolean;
};

let data: Schedule[] = [];

const dummySchedules = [
    { jam_awal: "07:00", jam_akhir: "08:00", status: true },
    { jam_awal: "09:00", jam_akhir: "10:00", status: false },
    { jam_awal: "11:00", jam_akhir: "12:00", status: true },
    { jam_awal: "13:00", jam_akhir: "14:00", status: false },
    { jam_awal: "15:00", jam_akhir: "16:00", status: false },
    { jam_awal: "17:00", jam_akhir: "18:00", status: false },
    { jam_awal: "19:00", jam_akhir: "20:00", status: false },
    { jam_awal: "21:00", jam_akhir: "22:00", status: false }
];

const hari: string[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

for (let i = 0; i < hari.length; i++) {
    for (let j = 0; j < dummySchedules.length; j++) {
        data.push({
            hari: hari[i],
            jam_awal: dummySchedules[j].jam_awal,
            jam_akhir: dummySchedules[j].jam_akhir,
            status: dummySchedules[j].status
        });
    }
}

export const seedSchedules = async () => {
    try {
        await MsSchedule.destroy({ where: {} });
        const existingSchedules = await MsSchedule.findAll({
            attributes: ["hari", "jam_awal", "jam_akhir"],
        });

        const existingSet = new Set(
            existingSchedules.map(
                (schedule) => `${schedule.hari}-${schedule.jam_awal}-${schedule.jam_akhir}`
            )
        );
        const newData = data.filter(
            (schedule) => !existingSet.has(`${schedule.hari}-${schedule.jam_awal}-${schedule.jam_akhir}`)
        );

        if (newData.length > 0) {
            await MsSchedule.bulkCreate(newData);
            console.log("Dummy schedules inserted successfully");
        } else {
            console.log("All schedules already exist, no data inserted");
        }
    } catch (error) {
        console.error("Error inserting dummy schedules:", error);
    }
};
