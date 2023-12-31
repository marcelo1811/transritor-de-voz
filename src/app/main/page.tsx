"use client";

import React, { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { Box, Button, Container, Flex, HStack, Heading, Table, Tbody, Td, Textarea, Thead, Tr, VStack, useClipboard } from "@chakra-ui/react";
import { FaRegCopy } from 'react-icons/fa';
import { IoMicOutline, IoStopCircleOutline } from 'react-icons/io5';

const keywords: Record<string, string> = {
  " pular linha ": "\n",
  " ponto e vírgula": ";",
  " dois pontos": ":",
  "abre parênteses ": "(",
  // "abre parêntese ": "(",
  " fecha parênteses": ")",
  // " fecha parêntese": ")",
  "abre chaves ": "{",
  // "abre chave ": "{",
  " fecha chaves": "}",
  // " fecha chave": "}",
  "abre colchetes ": "[",
  // "abre colchete ": "[",
  " fecha colchetes": "]",
  // " fecha colchete": "]",
  "abre aspas ": '"',
  " fecha aspas": '"',
  " aspas simples ": "'",
  " parágrafo ": "\n\n",
  " ponto final": ".",
  " três pontos": "...", // três pontos de ellipsis
  " ponto de exclamação": "!",
  " ponto de interrogação": "?",
  travessão: "—", // travessão em em-dash
  traço: "-", // travessão em em-dash
  aspas: '"',
  " vírgula": ",",
  " barra": "/",
  " barra invertida": "\\",
  " asterisco": "*",
};

const Main = () => {
  const { onCopy, value: text, setValue: setText, hasCopied } = useClipboard("");
  const { isRecording, startRecognition, stopRecognition, toggleRecognition } =
    useSpeechRecognition({
      onResult: (text: string) => {
        let formattedText = text.toLocaleLowerCase();
        Object.keys(keywords).forEach((keyword) => {
          formattedText = formattedText.replaceAll(
            keyword,
            keywords[keyword]
          );
        });
        formattedText = capitalizeAfterPunctuation(formattedText);
        setText((prevText) => prevText + formattedText);
      },
    });

  useEffect(() => {
    window.addEventListener("blur", () => {
      stopRecognition();
    });

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("blur", () => {
        stopRecognition();
      });
    };
  }, []);

  const capitalizeAfterPunctuation = (input: string) => {
    return input.replace(
      /([.?!\n]\s*)([a-z])/g,
      (match, punctuation, letter) => {
        return punctuation + letter.toUpperCase();
      }
    );
  };

  return (
    <Box paddingX='100px' paddingTop={'30px'}>
      <VStack alignItems='flex-start' gap={'10px'}>
        <Heading>Transcritor de Voz para Texto</Heading>
        <HStack gap={'10px'}>
          <Button leftIcon={isRecording ? <IoStopCircleOutline /> : <IoMicOutline />} onClick={toggleRecognition}>{isRecording ? 'Gravando...' : 'Iniciar gravação'}</Button>
          <Button leftIcon={<FaRegCopy />} onClick={onCopy}>{hasCopied ? "Copiado!" : "Copiar"}</Button>
        </HStack>
        <Flex height='80vh' width='100%'>
          <Textarea
            height='100%'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Box overflow={'scroll'} maxH='100%' width='30vw'>
            <Table variant='striped'>
              <Thead>
                <Tr fontWeight={'bold'}>
                  <Td>Palavra-chave</Td>
                  <Td>Valor</Td>
                </Tr>
              </Thead>
              <Tbody>
                {Object.entries(keywords).map(([keyword, value]) => (
                  <Tr key={keyword}>
                    <Td>{value}</Td>
                    <Td>{keyword.trim()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Main;
