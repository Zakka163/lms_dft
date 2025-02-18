import MsSchedule from "../modul/ms_schedule/model.js";

type Schedule = {
    hari: string;
    jam_awal: string;
    jam_akhir: string;
    status: boolean;
}

let data: Schedule[] = new Array();

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
        if (data.length > 0) {
            console.log("Inserting data:", data);
            await MsSchedule.bulkCreate(data);
            console.log("Dummy schedules inserted successfully");
        } else {
            console.log("No data to insert");
        }
    } catch (error) {
        console.error("Error inserting dummy schedules:", error);
    }
};

