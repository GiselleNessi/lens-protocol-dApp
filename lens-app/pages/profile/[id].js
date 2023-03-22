import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { client, getProfile, getPublications } from "../../api";
import Image from "next/image";

function ipfsToHttpUrl(ipfsUrl) {
  const ipfsGateway = "https://ipfs.io/ipfs/";
  const ipfsPath = ipfsUrl.replace("ipfs://", "");
  return `${ipfsGateway}${ipfsPath}`;
}

import ABI from "../../abi.json";
const address = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"

export default function Profile() {
  const [profile, setProfile] = useState();
  const [pubs, setPubs] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  async function fetchProfile() {
    try {
      const response = await client.query(getProfile, { id }).toPromise();
      console.log({ response });
      setProfile(response.data.profiles.items[0]);
      console.log({ id })
      const publicationData = await client.query(getPublications, { id }).toPromise();
      console.log({ publicationData });
      setPubs(publicationData.data.publications.items)
    } catch (err) {
      console.error({ err });
    }
  }

  if (!profile) return null;

  return (
    <div>
      {profile.picture && profile.picture.original ? (
        <Image
          width={200}
          height={200}
          src={ipfsToHttpUrl(profile.picture.original.url)}
        />
      ) : (
        <div
          style={{ width: "200px", height: "200px", backgroundColor: "black" }}
        />
      )}

      <div>
        <h4>{profile.handle}</h4>
        <p>{profile.bio}</p>
        <p>Followers: {profile.stats.totalFollowers}</p>
        <p>Following: {profile.stats.totalFollowing}</p>
      </div>

      <div>
        {
            pubs.map((pub, index) => (
                <div style={{padding: '20px', borderTop: '1px solid #ededed'}} key={index}>
                    {pub.metadata.content}
                </div>
            ))
        }
      </div>
    </div>
  );
}
