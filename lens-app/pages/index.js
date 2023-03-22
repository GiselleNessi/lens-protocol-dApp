import Link from "next/link";
import { useState, useEffect } from "react";
import { client, recommendedProfiles } from "../api";

export default function Home() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      const response = await client.query(recommendedProfiles).toPromise();
      console.log({ response });
      setProfiles(response.data.recommendedProfiles);
    } catch (err) {
      console.error({ err });
    }
  }

  return (
    <div>
      {profiles.map((profile, index) => (
        <Link href={`/profile/${profile.id}`} key={index}>
          <span>
            <div>
              {profile.picture && profile.picture.original ? (
                <img
                  src={profile.picture.original.url}
                  width="60px"
                  height="60px"
                />
              ) : (
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "black",
                  }}
                />
              )}
              <h4>{profile.handle}</h4>
              <p>{profile.bio}</p>
            </div>
          </span>
        </Link>
      ))}
    </div>
  );
}
