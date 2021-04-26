import { GetStaticProps } from "next"
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import api from "../services/api"
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString"

import styles from './home.module.scss';
import { usePlayer } from "../contexts/PlayerContext"

type Episode = {
  id:string;
  title:string;
  members:string;
  thumbnail:string;
  published_at:string;
  duration:number;
  durationAsString:string;
  url:string;
}

type HomeProps = {
  lastEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({lastEpisodes, allEpisodes}: HomeProps) {
  const { playlist } = usePlayer();

  const episodeList = [...lastEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.lastEpisodes}>
        <h2>Últimos episódios</h2>

        <ul>
          {lastEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.published_at}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playlist(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episodio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((ep, index) => {
              return (
                <tr key={ep.id}>
                  <td style={{width: 72}}>
                    <Image 
                      width={120} 
                      height={120} 
                      src={ep.thumbnail} 
                      alt={ep.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${ep.id}`}>
                      <a>{ep.title}</a>
                    </Link>
                  </td>
                  <td>{ep.members}</td>
                  <td style={{width:100}}>{ep.published_at}</td>
                  <td>{ep.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playlist(episodeList, index + lastEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar episodio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

      </section>
    </div>
  )
}

export const getStaticProps:GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit:12,
      _sort:'published_at',
      _order:'desc'
    }
  });

  const episodes = data.map(episode => {
    return {
      id:episode.id,
      title:episode.title,
      thumbnail:episode.thumbnail,
      members: episode.members,
      published_at: format(parseISO(episode.published_at), 'd MMM yy', {locale:ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url:episode.file.url
    }
  })

  const lastEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      lastEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}