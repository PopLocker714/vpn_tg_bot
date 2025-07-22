import { eq } from "drizzle-orm";
import { db } from ".";
import { vpnServersTable } from "./schema";
import { VpnServerLocation } from "../types";

const servers = [
  {
    id: 1,
    name: "Outline",
    location: VpnServerLocation.Germany,
    ip: "1.1.1.1",
  },
  { id: 2, name: "Shadow vpn", location: VpnServerLocation.UK, ip: "2.2.2.2" },
  {
    id: 3,
    name: "Wireguard vpn",
    location: VpnServerLocation.USA,
    ip: "3.3.3.3",
  },
];

const seed = async () => {
  await db
    .insert(vpnServersTable)
    .values(servers)
    .then((result) => {
      console.log("Seeded VPN servers:", result);
    })
    .catch(async (error) => {
      console.log(error.message);

      for await (const server of servers) {
        await db
          .update(vpnServersTable)
          .set({
            name: server.name,
            location: server.location,
            ip: server.ip,
          })
          .where(eq(vpnServersTable.id, server.id));
      }
      console.log("VPN servers updated successfully.");
    });
};

seed();
