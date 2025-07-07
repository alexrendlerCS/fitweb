import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-black border-gray-700 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_25px_50px_-12px_rgba(0,77,64,0.25)] hover:border-[#004d40]/50 hover:-translate-y-2">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <p className="text-lg text-gray-300 leading-relaxed">
                    I'm{" "}
                    <span className="text-[#004d40] font-semibold">
                      Alex Rendler
                    </span>{" "}
                    — a full-stack developer with a passion for building
                    smarter, scalable tools for fitness professionals.
                  </p>

                  <p className="text-lg text-gray-300 leading-relaxed">
                    I specialize in custom platforms that combine scheduling,
                    payments, and automation. I've helped personal trainers
                    streamline their businesses so they can focus on what they
                    do best — training clients.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#004d40]">
                        20+
                      </div>
                      <div className="text-gray-400">Projects Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#004d40]">
                        3+
                      </div>
                      <div className="text-gray-400">Years Experience</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="relative transition-all duration-500 ease-in-out hover:scale-105">
                    <div className="w-64 h-64 rounded-2xl overflow-hidden border-4 border-[#004d40] transition-all duration-500 ease-in-out hover:shadow-[0_20px_40px_-15px_rgba(0,77,64,0.4)]">
                      <Image
                        src="/me.png"
                        alt="Alex Rendler - Full Stack Developer"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover transition-all duration-500 ease-in-out hover:scale-105"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-[#004d40] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.3)]">
                      Full-Stack Developer
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
