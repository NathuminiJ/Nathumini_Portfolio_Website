import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Skills from "@/components/sections/Skills"
import Projects from "@/components/sections/Projects"
import Experience from "@/components/sections/Experience"
import Education from "@/components/sections/Education"
import Certifications from "@/components/sections/Certifications"
import Achievements from "@/components/sections/Achievements"
import Volunteering from "@/components/sections/Volunteering"
import Articles from "@/components/sections/Articles"
import Resume from "@/components/sections/Resume"

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Certifications />
      <Achievements />
      <Volunteering />
      <Articles />
      <Resume />
    </main>
  )
}
