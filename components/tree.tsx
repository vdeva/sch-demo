"use client"

import { useEffect, useRef, useState } from "react";

const orgChart = {
  name: "Is the opponent's argumentation already developed?",
  children: [
    {
      name: "Yes",
      children: [
        {
          name: "Does their argumentation put us at a disadvantage?",
          children: [
            {
              name: "Yes",
              children: [
                {
                  name: "Is the opponent attacking our thesis directly?",
                  children: [
                    {
                      name: "Yes",
                      children: [
                        {
                          name: "Is the attack objective?",
                          children: [
                            {
                              name: "Yes",
                              attributes: {
                                action: "Assume what needs to be proved, either under another name, by asserting a contested particular truth as a general truth, or by deriving all particular truths from a general truth.",
                                id: "1111"
                              }
                            },
                            {
                              name: "No",
                              attributes: {
                                action: "Check if some of the opponent's statements are not in contradiction with others, depending on the perspective from which they are considered.",
                                id: "1110"
                              }
                            }
                          ]
                        }
                      ]
                    },
                    {
                      name: "No",
                      children: [
                        {
                          name: "Can we use the opponent's statements against them?",
                          children: [
                            {
                              name: "Yes",
                              attributes: {
                                action: "Check if some of the opponent's statements are not in contradiction with others, depending on the perspective from which they are considered.",
                                id: "1101"
                              }
                            },
                            {
                              name: "No",
                              attributes: {
                                action: "Show impudence. Anger the opponent, because in their fury, they are unable to judge correctly or see their own interest.",
                                id: "1100"
                              }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: "No",
              children: [
                {
                  name: "Are the foundations of the opponent's thesis solid?",
                  children: [
                    {
                      name: "Yes",
                      children: [
                        {
                          name: "Can the thesis consequences be used against it?",
                          children: [
                            {
                              name: "Yes",
                              children: [
                                {
                                  name: "Does associating the thesis with a recognized truth lead to a contradiction?",
                                  children: [
                                    {
                                      name: "Yes",
                                      attributes: {
                                        action: "Apagogue - The art of deriving false conclusions: force the opponent's thesis to yield contradictory or general truths contradicting propositions not found in the thesis itself, thereby constructing an indirect refutation, an apagogue or reasoning by absurdity.",
                                        id: "10111"
                                      }
                                    },
                                    {
                                      name: "No",
                                      attributes: {
                                        action: "Find a contradictory example",
                                        id: "10110"
                                      }
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              name: "No",
                              children: [
                                {
                                  name: "Is the opponent in a position of strength?",
                                  children: [
                                    {
                                      name: "Yes",
                                      attributes: {
                                        action: "Diversion",
                                        id: "10101"
                                      }
                                    },
                                    {
                                      name: "No",
                                      children: [
                                        {
                                          name: "Can we demonstrate that the foundations are false?",
                                          children: [
                                            {
                                              name: "Yes",
                                              children: [
                                                {
                                                  name: "Assume what needs to be proved, either under another name, by asserting a contested particular truth as a general truth, or by deriving all particular truths from a general truth.",
                                                  attributes: {
                                                    action: "Assume what needs to be proved",
                                                    id: "101001"
                                                  }
                                                }
                                              ]
                                            },
                                            {
                                              name: "No",
                                              children: [
                                                {
                                                  name: "Honest or not?",
                                                  children: [
                                                    {
                                                      name: "Yes",
                                                      attributes: {
                                                        action: "Strengthen the attack - Assume what needs to be proved, either under another name, by asserting a contested particular truth as a general truth, or by deriving all particular truths from a general truth.",
                                                        id: "1010001"
                                                      }
                                                    },
                                                    {
                                                      name: "No",
                                                      attributes: {
                                                        action: "Mischievous Trick - Fallacy of non causa pro causa - present a reason as though it were a cause: when the opponent has answered several questions unfavorably, yet declare that the deduction we wanted to achieve is proven.",
                                                        id: "1010000"
                                                      }
                                                    }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      name: "No",
                      attributes: {
                        action: "Last-Resort Diversion - Use diversion as a last resort if defeat seems imminent. Talk about something entirely different as if it were part of the debated subject, with varying degrees of discretion or impudence.",
                        id: "100"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "No",
      children: [
        {
          name: "Is the opponent's thesis clearly defined?",
          children: [
            {
              name: "Yes",
              children: [
                {
                  name: "Does the thesis contradict previous statements of the opponent (ad hominem)?",
                  children: [
                    {
                      name: "Yes",
                      attributes: {
                        action: "Ad hominem argument to highlight contradictions",
                        id: "011"
                      }
                    },
                    {
                      name: "No",
                      attributes: {
                        action: "The art of deriving false conclusions: force the opponent's thesis to yield contradictory or general truths contradicting propositions not found in the thesis itself, thereby constructing an indirect refutation, an apagogue or reasoning by absurdity.",
                        id: "010"
                      }
                    }
                  ]
                }
              ]
            },
            {
              name: "No",
              attributes: {
                action: "Stretch the opponent's claim beyond its natural limits, interpret it as broadly as possible, take it in the widest sense, and exaggerate. At the same time, reduce your own claim to the strictest possible sense: the more general a claim becomes, the more vulnerable it is to attack.",
                id: "00"
              }
            }
          ]
        }
      ]
    }
  ]
};

export const TreeVisualization = ({ actionId }) => {
  const [path, setPath] = useState([]);
  const initialized = useRef(false);
  const containerRef = useRef(null);  // useRef for the container to enable auto-scroll

  useEffect(() => {
    if (!actionId || initialized.current) {
      return;
    }
    initialized.current = true;

    const findPath = (node, id, trail = []) => {
      if (node.attributes && node.attributes.id === id) {
        return [...trail, node];
      }
      if (node.children) {
        for (let child of node.children) {
          const result = findPath(child, id, [...trail, node]);
          if (result) return result;
        }
      }
      return null;
    };

    const displayPathWithDelay = (pathFound) => {
      setPath([]);
      if (pathFound) {
        pathFound.reduce((promise, node, index) => {
          return promise.then(() => {
            return new Promise(resolve => {
              setTimeout(() => {
                setPath(prevPath => [...prevPath, node]);
                resolve();
              }, 100 * (index + 1));
            });
          });
        }, Promise.resolve());
      }
    };

    const pathFound = findPath(orgChart, actionId);
    if (pathFound) {
      displayPathWithDelay(pathFound);
    }
  }, [actionId]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [path]);

  // Function to render the action node if exists
  const renderActionNode = (action) => {
    if (action && action.attributes) {
      return (
        <div className="flex flex-col items-center">
          <div className="h-6 w-1 bg-slate-400/60"></div>
          <li key={action.attributes.id} className="rounded-lg shadow-xl px-4 py-3 text-xs max-2-[100px] border-2 border-purple-400/90">
            {action.attributes.action}
          </li>
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={containerRef} className="py-12 px-4 max-h-screen overflow-y-scroll">
      <ul className="flex flex-col items-center">
        {path.map((node, index) => (
          <div key={index} className="flex flex-col items-center">
          {index != 0 && <div className="h-6 w-1 bg-slate-400/60"></div>}
          <li className={`rounded-lg shadow-xl px-4 py-3 text-xs max-2-[100px]
          border-2  example-style
          ${node.name == 'Yes' ? 'border-emerald-400/90' :
            node.name == 'No' ? 'border-red-400/90' :
            'border-blue-200'
          }
          `}
          >{node.name}</li>
          {index === path.length - 1 && renderActionNode(node)}
        </div>
        ))}
      </ul>
    </div>
  );


  return (
    <div ref={containerRef} className="py-12 px-4 max-h-screen overflow-y-scroll">
      <ul className="flex flex-col items-center">
        {path.map((node, index) => (
          <div key={index} className="flex flex-col items-center">
            {index !== 0 && <div className="h-6 w-1 bg-slate-200"></div>}
            <li className={`rounded-lg shadow-md px-4 py-3 text-xs max-2-[100px] border-2  example-style ${node === 'Yes' ? 'border-emerald-300' : node === 'No' ? 'border-red-300' : 'border-blue-200'}`}>
              {node.name}
            </li>
            {/* Render action node if exists */}
            {index === path.length - 1 && renderActionNode(node)}
          </div>
        ))}
      </ul>
    </div>
  );
};